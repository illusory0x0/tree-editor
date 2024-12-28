import { Array, array, Assert, Maybe, String } from '../Prelude'
import { Vector, Color, Font, Size } from '../Base'
import { Element, Renderable } from '../Element'
import { Doc, Expr, Line, Text, TextCursor, TextSelection } from '../Expr'
import { drop, take } from '../Prelude/Array'

export type t = {
  exp: Expr.t
  doc: Doc.t
  csrbij: TextCursor.Bijection
  selbij: TextSelection.Bijection
  txtcsr: TextCursor.t
  expcsr: Expr.t
  txtsel: TextSelection.t
}

export let make = (exp: Expr.t): t => {
  let doc = Doc.format(exp, false)
  let txtcsr = TextCursor.make(0, 0)
  let selbij = TextSelection.makeBijection(doc)
  let csrbij = TextSelection.toTextCursorBijection(selbij)
  let expcsr = TextCursor.toExpr(txtcsr, csrbij)
  let txtsel = TextSelection.fromExpr(expcsr, selbij)

  return { txtcsr, expcsr, txtsel, exp, doc, selbij, csrbij }
}

export let update_txtcsr = (model: t, txtcsr: TextCursor.t) => {
  model.txtcsr = txtcsr
  model.expcsr = TextCursor.toExpr(model.txtcsr, model.csrbij)
  model.txtsel = TextSelection.fromExpr(model.expcsr, model.selbij)
}

export let update_expcsr = (model: t, expcsr: Expr.t) => {
  model.expcsr = expcsr
  model.txtcsr = TextCursor.fromExpr(Expr.firstLeaf(model.expcsr), model.csrbij)
  model.txtsel = TextSelection.fromExpr(model.expcsr, model.selbij)
}