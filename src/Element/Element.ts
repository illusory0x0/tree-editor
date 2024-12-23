import { Vector, Size, Font, Color, Thickness, round } from "../Base";
import { array, Array, Assert } from "../Prelude"
import * as Renderable from "./Renderable";

enum Tag { Layout = "Layout", Render = "Render" }

export type t =
  { readonly tag: Tag.Layout, readonly size: Size.t, readonly children: array<PositionedElement> } |
  { readonly tag: Tag.Render, readonly renderable: Renderable.t }

export let Layout = (size: Size.t, children: array<PositionedElement>): t => ({ tag: Tag.Layout, size, children })
export let Render = (renderable: Renderable.t): t => ({ tag: Tag.Render, renderable })

export type PositionedElement = { readonly offset: Vector.t, readonly element: t }

export let elim = <R>(e: t,
  elimLayout: arrow2<Size.t, array<PositionedElement>, R>,
  elimRender: arrow<Renderable.t, R>): R => {
  switch (e.tag) {
    case Tag.Layout: return elimLayout(e.size, e.children);
    case Tag.Render: return elimRender(e.renderable);
    default: return Assert.unreachable();
  }
}

export let getSize = (e: t): Size.t => elim(e, (sz, _) => sz, (r) => r.size)

export let position = (offset: Vector.t, element: t): PositionedElement => ({ offset, element })

export let PoistionFor = {
  // element: (offset: Vector.t, element: t): PositionedElement => ({ offset, element }),
  // renderable: (offset: Vector.t, renderable: Renderable.t): Renderable.PositionedRenderable => ({ offset, renderable })
}

export let hstack = (contents: array<t>, spacing: int): t => {
  let size = Size.make(
    Array.sumMap(contents, e => getSize(e).width) + (contents.length - 1) * spacing,
    Array.maximumMap(contents, e => getSize(e).height)
  )
  let offsets = Array.scanl(contents, Vector.zero,
    (s, e) => Vector.make(
      s.x + getSize(e).width + spacing,
      s.y
    )
  )
  let children = Array.zipWith(Array.take(offsets, contents.length), contents, position)
  return Layout(size, children)
}

export let vstack = (contents: array<t>, spacing: int): t => {
  let size = Size.make(
    Array.maximumMap(contents, e => getSize(e).width),
    Array.sumMap(contents, e => getSize(e).height) + (contents.length - 1) * spacing
  )

  let offsets = Array.scanl(contents, Vector.zero,
    (s, e) => Vector.make(
      s.x,
      s.y + getSize(e).height + spacing
    ),
  )
  let children = Array.zipWith(Array.take(offsets, contents.length), contents, position)
  return Layout(size, children)
}



export let getWithMarginSize = (content: t, { left, top, right, bottom }: Thickness.t): Size.t => {
  let { width, height } = getSize(content)
  let size = Size.make(width + left + right, height + top + bottom)
  return size
}
export let getMarginOffset = ({ left, top }: Thickness.t): Vector.t => {
  let offset = Vector.make(left, top)
  return offset
}

export let border = (content: t, thickness: Thickness.t, color: Color.t) => {
  let size = getWithMarginSize(content, thickness)
  let offset = getMarginOffset(thickness)

  let children = [
    position(
      Vector.zero,
      Render(Renderable.Border(size, color, thickness))),
    position(offset, content),
  ]
  return Layout(size, children)
}

export let padding = (content: t, thickness: Thickness.t, color: Color.t) => {
  let size = getWithMarginSize(content, thickness)
  let offset = getMarginOffset(thickness)

  let children = [
    position(
      Vector.zero,
      Render(Renderable.Rectangle(size, color))),
    position(offset, content),
  ]
  return Layout(size, children)
}

export let getRenderSequence = (root: t, origin: Vector.t): array<Renderable.PositionedRenderable> => {
  Assert.assert(origin.x >= 0 && origin.y >= 0)
  // do not render if the element is out of the screen
  if (origin.x >= window.innerWidth || origin.y >= window.innerHeight) { return [] }
  return elim(root,
    (size, children) => {
      return Array.flatMap(children,
        ({ offset, element }) => getRenderSequence(element, Vector.add(origin, offset))
      )
    },
    (r) => [Renderable.position(origin, r)]
  )
}

export let spacer = (size: Size.t) => {
  return Layout(size, [])
}

export let layer = (contents : array<PositionedElement>) => {
  let size = Size.make(
    Array.maximumMap(contents, pe => getSize(pe.element).width),
    Array.maximumMap(contents, pe => getSize(pe.element).height )
  )
  return Layout(size, contents)
}