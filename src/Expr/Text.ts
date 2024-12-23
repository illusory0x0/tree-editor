import { Color } from "../Base";
import * as Expr from "./Expr";
import { array, Assert } from "../Prelude"

enum Tag {
  ColorText = "Text",
  Anchor = "Anchor",
}

export type t =
  { tag: Tag.ColorText, text: string, color: Color.t } |
  { tag: Tag.Anchor, value: Expr.t }


export let Anchor = (expr: Expr.t): t => ({ tag: Tag.Anchor, value: expr })
export let ColorText = (text: string, color: Color.t): t => ({ tag: Tag.ColorText, text, color })


export let elim = <r>(text: t, elimColorText: arrow2<string, Color.t, r>, elimAnchor: (expr: Expr.t) => r): r => {
  switch (text.tag) {
    case Tag.ColorText: return elimColorText(text.text, text.color)
    case Tag.Anchor: return elimAnchor(text.value)
    default: return Assert.unreachable()
  }
}

export let length = (text: t): int => elim(text, colorText => colorText.length, _ => 0)
