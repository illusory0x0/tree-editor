import { Vector, Size, Font, Color, Thickness, round } from "../Base";
import { measureText } from "../Base/Font";
import { array, maximumMap, sumMap, scanl, zipWith, assert, flatMap, iter ,take } from "../Prelude"

enum ElementTag { Layout = "Layout", Render = "Render" }
enum RenderableTag { Text = "Text", Rectangle = "Rectangle", Border = "Border" }


export type Element =
  { readonly TAG: ElementTag.Layout, readonly size: Size.t, readonly children: array<PositionedElement> } |
  { readonly TAG: ElementTag.Render, readonly renderable: Renderable }

export let Layout = (size: Size.t, children: array<PositionedElement>): Element => ({ TAG: ElementTag.Layout, size, children })
export let Render = (renderable: Renderable): Element => ({ TAG: ElementTag.Render, renderable })


export type Renderable =
  ({ readonly TAG: RenderableTag.Text, readonly font: Font.t, readonly text: string, } |
  { readonly TAG: RenderableTag.Rectangle, } |
  { readonly TAG: RenderableTag.Border, readonly thickness: Thickness.t }) & { readonly size: Size.t, readonly color: Color.t }

export let Text = (size: Size.t, color: Color.t, font: Font.t, text: string): Renderable => ({ TAG: RenderableTag.Text, size, color, font, text })
export let Rectangle = (size: Size.t, color: Color.t): Renderable => ({ TAG: RenderableTag.Rectangle, size, color })
export let Border = (size: Size.t, color: Color.t, thickness: Thickness.t): Renderable => ({ TAG: RenderableTag.Border, size, color, thickness })


export type PositionedElement = { readonly offset: Vector.t, readonly element: Element }

export type PositionedRenderable = { readonly offset: Vector.t, readonly renderable: Renderable }

export let elimRenderable = <R>(r: Renderable,
  elimText: arrow4<Size.t, Color.t, Font.t, string, R>,
  elimRect: arrow2<Size.t, Color.t, R>,
  elimBorder: arrow3<Size.t, Color.t, Thickness.t, R>): R => {
  switch (r.TAG) {
    case RenderableTag.Text: return elimText(r.size, r.color, r.font, r.text);
    case RenderableTag.Rectangle: return elimRect(r.size, r.color);
    case RenderableTag.Border: return elimBorder(r.size, r.color, r.thickness);
  }
}

export let elimElement = <R>(e: Element,
  elimLayout: arrow2<Size.t, array<PositionedElement>, R>,
  elimRender: arrow<Renderable, R>): R => {
  switch (e.TAG) {
    case ElementTag.Layout: return elimLayout(e.size, e.children);
    case ElementTag.Render: return elimRender(e.renderable);
  }
}

export let getSize = (e: Element): Size.t => elimElement(e, (sz, _) => sz, (r) => r.size)

export let PoistionFor = {
  element: (offset: Vector.t, element: Element): PositionedElement => ({ offset, element }),
  renderable: (offset: Vector.t, renderable: Renderable): PositionedRenderable => ({ offset, renderable })
}


export let hstack = (contents: array<Element>, spacing: int): Element => {
  let size = Size.make(
    sumMap(e => getSize(e).width, contents) + (contents.length - 1) * spacing,
    maximumMap(e => getSize(e).height, contents)
  )
  let offsets = scanl(
    (s, e) => Vector.make(
      s.x + getSize(e).width + spacing,
      s.y
    ),
    Vector.zero,
    contents,
  )
  let children = zipWith(PoistionFor.element, take(contents.length,offsets), contents)
  return Layout(size, children)
}

export let vstack = (contents: array<Element>, spacing: int): Element => {
  let size = Size.make(
    maximumMap(e => getSize(e).width, contents),
    sumMap(e => getSize(e).height, contents) + (contents.length - 1) * spacing
  )

  let offsets = scanl(
    (s, e) => Vector.make(
      s.x,
      s.y + getSize(e).height + spacing
    ),
    Vector.zero,
    contents,
  )
  let children = zipWith(PoistionFor.element, take(contents.length,offsets), contents)
  return Layout(size, children)
}

export let text = (content: string, font: Font.t, color: Color.t): Renderable => {
  let m = measureText(content, font)
  let h = m.fontBoundingBoxAscent + m.fontBoundingBoxDescent
  let w = m.width
  let size = Size.make(round(w), round(h))
  return Text(size, color, font, content)
}

export let getWithMarginSize = (content: Element, { left, top, right, bottom }: Thickness.t): Size.t => {
  let { width, height } = getSize(content)
  let size = Size.make(width + left + right, height + top + bottom)
  return size
}
export let getMarginOffset = ({ left, top }: Thickness.t): Vector.t => {
  let offset = Vector.make(left, top)
  return offset
}

export let border = (content: Element, thickness: Thickness.t, color: Color.t) => {
  let size = getWithMarginSize(content, thickness)
  let offset = getMarginOffset(thickness)

  let children = [
    PoistionFor.element(
      Vector.zero,
      Render(Border(size, color, thickness))),
    PoistionFor.element(offset, content),
  ]
  return Layout(size, children)
}

export let padding = (content: Element, thickness: Thickness.t, color: Color.t) => {
  let size = getWithMarginSize(content, thickness)
  let offset = getMarginOffset(thickness)

  let children = [
    PoistionFor.element(
      Vector.zero,
      Render(Rectangle(size, color))),
    PoistionFor.element(offset, content),
  ]
  return Layout(size, children)
}

export let render = (r: Renderable, ctx: CanvasRenderingContext2D, { x, y }: Vector.t): void => {

  ctx.fillStyle = Color.toCSS(r.color)

  elimRenderable(r,
    (size, color, font, text) => {
      ctx.font = Font.toCSS(font)
      ctx.textBaseline = "top"
      ctx.fillText(text, x, y)

    }, (size, color) => {
      ctx.fillRect(x, y, size.width, size.height)

    }, (size, color, { left, top, right, bottom }) => {
      ctx.fillRect(x, y, size.width, size.height)

      let cx = x + left
      let cy = y + top
      let cw = size.width - left - right
      let ch = size.height - top - bottom
      ctx.clearRect(cx, cy, cw, ch)
    }
  )
}

export let getRenderSequence = (origin: Vector.t, root: Element): array<PositionedRenderable> => {
  assert(origin.x >= 0 && origin.y >= 0)
  // do not render if the element is out of the screen
  if (origin.x >= window.innerWidth || origin.y >= window.innerHeight) { return [] }
  return elimElement(root,
    (size, children) => {
      return flatMap(
        ({ offset, element }) => getRenderSequence(Vector.add(origin, offset), element), children
      )
    },
    (r) => [PoistionFor.renderable(origin, r)]
  )
}

export let renderSequence = (ctx: CanvasRenderingContext2D, rs: array<PositionedRenderable>): void => {
  iter(({ offset, renderable }) => {
    assert(offset.x < window.innerWidth && offset.y < window.innerHeight)
    return render(renderable, ctx, offset)
  }, rs)
}