import { Color } from "../Base";
import { array, Assert, Array } from "../Prelude"
import * as Expr from "./Expr";
import * as Glyph from "../Base/Glyph"
import * as Text from './Text'
import * as Line from './Line'

export type t = array<Line.t>
export let make = (lines: array<Line.t>): t => lines


let envelop = (doc: t, leftDelimiter: Text.t, rightDelimiter: Text.t): t => {
  return Array.elimBidirectional(doc,
    [Line.make(0, [leftDelimiter, rightDelimiter])],
    x => [Line.cons(leftDelimiter, Line.snoc(x, rightDelimiter))],
    (h, m, l) =>
      [
        Line.cons(leftDelimiter, h),
        ...m,
        Line.snoc(l, rightDelimiter)
      ]
  )
}

let bracket = (doc: t): t => {
  let lb = Text.ColorText("(", Color.white)
  let rb = Text.ColorText(")", Color.white)
  return envelop(doc, lb, rb)
}

let anchor = (doc: t, e: Expr.t): t => {
  let a = Text.Anchor(e)
  return envelop(doc, a, a)
}

let space = Text.ColorText(" ", Color.white)
let none = Text.ColorText("", Color.white)

let joinline = (top: t, bot: t, sep: Text.t): t => {
  if (top.length === 0) {
    return bot
  } else {
    if (bot.length === 0) {
      return top
    } else {
      let top_init = Array.take(top, top.length - 1)
      let top_last = Array.last(top)

      let bot_head = Array.head(bot)
      let bot_tail = Array.tail(bot)
      return [
        ...top_init,
        Line.append(top_last, Line.cons(sep, bot_head)),
        ...bot_tail]
    }
  }
}
export let lastlineWidth = (doc: t): int => {
  if (doc.length === 0) {
    return 0
  } else {
    return Line.width(Array.last(doc))
  }
}

export let width = (doc: t): int => {
  return Array.maximumMap(doc, Line.width)
}

export let summarize = (doc: t): int => {
  return Array.foldl(doc, 0, (acc, line) => acc + Line.width(line))
}

export let separrateWithSpace = (doc: t) => {
  if (doc.length === 0) {
    return doc
  } else {
    let x = Array.head(doc)
    let xs = Array.tail(doc)
    return [Array.foldl(xs, x, (acc, line) => {
      return Line.append(acc, Line.cons(space, line))
    })]
  }
}

export let indentRest = (doc: t, n: int) => {
  if (doc.length === 0) {
    return doc
  } else {
    let x = Array.head(doc)
    let xs = Array.tail(doc)
    return [x, ...Array.map(xs, line => Line.indent(n, line))]
  }
}

export let indent = (doc: t, n: int) => {
  return Array.map(doc, line => Line.indent(n, line))
}

export let format = (expr: Expr.t, isBracket: boolean): t => {

  let br = (x: t) => { return isBracket ? bracket(indentRest(x, 1)) : x }

  let result = Expr.elim2(expr,
    name => [Line.make(0, [Text.ColorText(name, Color.white)])],
    (func, args) => {
      let dfunc = format(func, true)
      let dargs = format(args, true)

      if (summarize(dfunc) + summarize(dargs) <= 10) {
        return br(
          separrateWithSpace(Array.flatten([dfunc, dargs]))
        )
      } else {
        let joinlineThreshold = 10
        let maxWidth = Array.maximumMap([dfunc, dargs], width)
        if (lastlineWidth(dfunc) + Array.maximumMap(dargs, Line.width) <= joinlineThreshold) {
          return br(joinline(dfunc, dargs, space))
        } else {
          return br(
            [
              ...dfunc,
              ...dargs
            ]
          )
        }
      }
    },
    (parm, body) => {
      let ctlam = Text.ColorText(Glyph.lambda, Color.white);
      let lparm = format(parm,false)[0]
      let ctdot = Text.ColorText(".", Color.white);
      
      let first_line = Line.cons(ctlam, Line.snoc(lparm,ctdot))
      let rest_line = format(body, false)

      let joinlineThreshold = 80
      let indentation = Line.width(first_line)

      if (Line.width(first_line) + Array.maximumMap(rest_line, Line.width) <= joinlineThreshold) {
        return br(joinline([first_line], indentRest(rest_line, indentation), none))
      }
      else {
        return br([
          first_line,
          ...indent(format(body, false), 2)
        ])
      }
    }
  )
  return anchor(result, expr)
}

export let toString = (doc: t): string => {
  return Array.foldl(doc, "", (acc, line) => {
    return acc + " " + Array.foldl(line.texts, "", (acc, text) => {
      return acc + Text.elim(text, (text, _) => text, _ => "")
    })
  })
}

