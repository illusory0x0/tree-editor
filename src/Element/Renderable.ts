import { Vector, Size, Font, Color, Thickness } from "../Base";
import { array, Array, Assert } from "../Prelude"

enum Tag { Text = "Text", Rectangle = "Rectangle", Border = "Border" }

export type t =
  ({ readonly tag: Tag.Text, readonly font: Font.t, readonly text: string, } |
  { readonly tag: Tag.Rectangle, } |
  { readonly tag: Tag.Border, readonly thickness: Thickness.t }) & { readonly size: Size.t, readonly color: Color.t }

export let Text = (size: Size.t, color: Color.t, font: Font.t, text: string): t => ({ tag: Tag.Text, size, color, font, text })
export let Rectangle = (size: Size.t, color: Color.t): t => ({ tag: Tag.Rectangle, size, color })
export let Border = (size: Size.t, color: Color.t, thickness: Thickness.t): t => ({ tag: Tag.Border, size, color, thickness })

export let elim = <R>(r: t,
  elimText: arrow4<Size.t, Color.t, Font.t, string, R>,
  elimRect: arrow2<Size.t, Color.t, R>,
  elimBorder: arrow3<Size.t, Color.t, Thickness.t, R>): R => {
  switch (r.tag) {
    case Tag.Text: return elimText(r.size, r.color, r.font, r.text);
    case Tag.Rectangle: return elimRect(r.size, r.color);
    case Tag.Border: return elimBorder(r.size, r.color, r.thickness);
    default: return Assert.unreachable();
  }
}

export type PositionedRenderable = { readonly offset: Vector.t, readonly renderable: t }


export let render = (r: t, ctx: CanvasRenderingContext2D, { x, y }: Vector.t): void => {

  ctx.fillStyle = Color.toCSS(r.color)

  elim(r,
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



export let renderSequence = (ctx: CanvasRenderingContext2D, rs: array<PositionedRenderable>): void => {
  Array.iter(rs, ({ offset, renderable }) => {
    if (offset.x < window.innerWidth && offset.y < window.innerHeight) {
      render(renderable, ctx, offset)
    }
  })
}

export let text = (content: string, font: Font.t, color: Color.t): t => {
  let round = Math.round
  let m = Font.measureText(content, font)
  let h = m.fontBoundingBoxAscent + m.fontBoundingBoxDescent
  let w = m.width
  let size = Size.make(round(w), round(h))
  return Text(size, color, font, content)
}

export let position = (offset: Vector.t, renderable: t): PositionedRenderable => ({ offset, renderable })
