import * as Expr from './Expr';
import * as TextCursor from './TextCursor';
import * as Doc from './Doc';
import * as Text from './Text';
import { Assert, Maybe, Array } from '../Prelude';

export type t = {
  start: TextCursor.t;
  end: TextCursor.t;
}
export let make = (start: TextCursor.t, end: TextCursor.t): t => ({ start, end });

export type Bijection = Map<Expr.t, t>;

export let fromExpr = (expr: Expr.t, bijection: Bijection): t => {
  return Maybe.fromJust(bijection.get(expr))
}

export let makeBijection = (doc: Doc.t): Bijection => {
  let m_start = new Map<Expr.t, TextCursor.t>();
  let m_end = new Map<Expr.t, TextCursor.t>();

  for (let row = 0; row < doc.length; row++) {
    let col = 1;
    for (let text of doc[row].texts) {
      Text.elim(text,
        (_, __) => { col += 1; },
        anchor => {
          let cursor = TextCursor.make(row, col);
          if (!m_start.has(anchor)) {
            m_start.set(anchor, cursor);
          } else if (!m_end.has(anchor)) {
            m_end.set(anchor, cursor);
          } else {
            Assert.unreachable();
          }
        }
      )
    }
  }
  let result = new Map<Expr.t, t>();
  for (let [key, value] of m_start) {
    result.set(key, make(value, Maybe.fromJust(m_end.get(key))));
  }
  return result;
}

export let toTextCursorBijection = (bijection: Bijection): TextCursor.Bijection => {
  let w: [Expr.t, TextCursor.t][] = []

  for (let [key, { start }] of bijection) {
    if (key.tag === Expr.Tag.Var) {
      w.push([key, start])
    }
  }
  w = Array.sortBy(w, ([e1, c1], [e2, c2]) => c1.row - c2.row)


  let w2 = Array.groupl(w, TextCursor.make(0, 0),
    (_, [e, c]) => c,
    (s, [e, c]) => s.row === c.row
  )

  w2 = Array.map(w2, 
    x => Array.sortBy(x, ([e1, c1], [e2, c2]) => c1.col - c2.col
  ))
  return Array.map(w2, x => Array.map(x, ([e, c]) => e))
}
