import { array } from "../Prelude"
import * as Expr from "./Expr"

export type t = {
  readonly row: int,
  readonly col: int
}

export type Bijection = array<array<Expr.t>>
export let make = (row: int, col: int): t => ({ row, col })

export let toExpr = (cursor: t, bijection: Bijection): Expr.t => {
  return bijection[cursor.row][cursor.col]
}

export let fromExpr = (expr: Expr.t, bijection: Bijection): t => {
  for (let row = 0; row < bijection.length; row++) {
    for (let col = 0; col < bijection[row].length; col++) {
      if (expr === bijection[row][col]) {
        return { row, col }
      }
    }
  }
  throw new Error("Expr not found in bijection")
}

//#region private function
let maxRow = (b: Bijection): int => b.length
let maxCol = (row: int, b: Bijection): int => b[row].length
//#endregion

export let moveLeft = (c: t, b: Bijection): t => {
  return make(c.row, c.col > 0 ? c.col - 1 : c.col)
}

export let moveRight = (c: t, b: Bijection): t => {
  return make(c.row, c.col < maxCol(c.row, b) - 1 ? c.col + 1 : c.col)
}

export let moveUp = (c: t, b: Bijection): t => {
  let row = c.row > 0 ? c.row - 1 : c.row
  let maxcol = maxCol(row, b)
  let col = c.col < maxcol ? c.col : maxcol - 1
  return make(row, col)
}

export let moveDown = (c: t, b: Bijection): t => {
  let row = c.row < maxRow(b) - 1 ? c.row + 1 : c.row
  let maxcol = maxCol(row, b)
  let col = c.col < maxcol ? c.col : maxcol - 1
  return make(
    row,
    col
  )
}