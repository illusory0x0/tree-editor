import { array, Assert } from "../Prelude"
import { t, Var, Abs, Name, App, elim, equal } from "./Expr"
import { Env } from "./Value"


export let zero = Abs("f", Abs("x", Var("x")))
export let add1 =
  Abs("n",
    Abs("f",
      Abs("x",
        App(Var("f"),
          App(App(Var("n"),
            Var("f")),
            Var("x"))))))
export let add =
  Abs("m",
    Abs("n",
      App(App(Var("n"),
        Var("add1")),
        Var("m"))))

export let defs: array<[Name, t]> = [
  ["zero", zero],
  ["add1", add1],
  ["add", add],
]

export let from = (n: number): t => {
  return n === 0 ? Var("zero") : App(Var("add1"), from(n - 1))
}

// 0 = \f.\x.x 
// 1 = \f.\x.f x
// 2 = \f.\x.f (f x)
// 3 = \f.\x.f (f (f x))

export let toNumber = (e: t): number => {
  return elim(e,
    _ => { return Assert.unreachable() },
    (_, __) => { return Assert.unreachable() },
    (f, body) => {
      return elim(body,
        _ => { return Assert.unreachable() },
        (_, __) => { return Assert.unreachable() },
        (x, body) => {
          let toN = (e: t): number => {
            return elim(e,
              x => {
                return 0
              },
              (f, x) => {
                return 1 + toN(x)
              },
              (f, body) => {
                return Assert.unreachable()
              }
            )
          }
          return toN(body)
        }
      )
    }
  )
}