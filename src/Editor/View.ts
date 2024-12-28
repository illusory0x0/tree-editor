import { Array, array, Assert, Maybe, String } from '../Prelude'
import { Vector, Color, Font, Size } from '../Base'
import { Element, Renderable } from '../Element'
import { Doc, Expr, Line, Text, TextCursor, TextSelection } from '../Expr'
import { drop, take } from '../Prelude/Array'

import * as Model from './Model'

type View = {
  sel: Element.PositionedElement,
  doc: Element.t
}


export let monospace = Font.make(["Cascadia Mono"], [Font.GenericFamily.Monospace], 10, Font.Style.Normal, 320);

//#region private function
let viewLine = (line: Line.t): Element.t => {
  let indentation = String.replicate(" ", line.indentation)
  let rest: array<Element.t> = Array.mapMaybes(line.texts,
    text => Text.elim(text,
      (text, color) => Element.Render(Renderable.text(text, monospace, color)),
      _ => Maybe.Nothing))
  return Element.hstack(
    [
      Element.Render(Renderable.text(indentation, monospace, Color.white)),
      ...rest
    ], 0
  )
}
let viewDoc = (doc: array<Line.t>): Element.t => {
  return Element.vstack(Array.map(doc, viewLine), 0)
}

let viewTextSelection = (edoc: Element.t, { start, end }: TextSelection.t, color: Color.t) => {
  let sum_width = (xs: array<Element.PositionedElement>) => Array.sumMap(xs, x => Element.getSize(x.element).width)
  let max_height = (xs: array<Element.PositionedElement>) => Array.maximumMap(xs, x => Element.getSize(x.element).height)
  let getSize = (xs: array<Element.PositionedElement>) => Size.make(sum_width(xs), max_height(xs))

  let children = (e: Element.t) => Element.elim(e, (_, children) => children, _ => Assert.unreachable())
  let rectangle = (sz: Size.t) => Element.Render(Renderable.Rectangle(sz, color))

  if (start.row === end.row) {
    let eline = children(edoc)[start.row]

    let offset = Vector.make(
      children(eline.element)[start.col].offset.x,
      eline.offset.y
    )
    let line = take(drop(children(eline.element), start.col), end.col - start.col)
    let r = rectangle(getSize(line))
    return Element.position(offset, r)

  } else {
    let efirst_line = children(edoc)[start.row]
    let offset = efirst_line.offset

    let [head_line_spacer_size, head_line_rectangle_size] = Array.splitAt(children(efirst_line.element), start.col)

    let head_line = Element.hstack(
      [
        Element.spacer(
          getSize(head_line_spacer_size)
        ),
        rectangle(getSize(head_line_rectangle_size))
      ], 0
    )

    let middle_lines = Array.map(Array.slice(children(edoc), start.row + 1, end.row),
      eline => rectangle(Element.getSize(eline.element)))

    let last_line_size = Array.take(children(children(edoc)[end.row].element), end.col)
    let last_line = rectangle(getSize(last_line_size))
    return Element.position(offset, Element.vstack([
      head_line,
      ...middle_lines,
      last_line
    ], 0))
  }
}
//#endregion

export let make = (model: Model.t): View => {
  let doc = viewDoc(model.doc)
  let sel = viewTextSelection(doc, model.txtsel, Color.gray)
  return { sel, doc }
}
export let sync_txtsel = (view: View, txtsel: TextSelection.t) => {
  view.sel = viewTextSelection(view.doc, txtsel, Color.gray)
}
export let toRenderSequence = (view: View, origin: Vector.t) => {
  return Element.getRenderSequence(Element.layer(
    [
      view.sel,
      Element.position(Vector.make(0, 0), view.doc)
    ]
  ), origin)
}