import { array, Array, Assert, Maybe } from "../Prelude";
import { Name } from "./Expr";
import * as Expr from "./Expr"

enum Tag { VAbs = "VAbs", VNeutral = "VNeutral", }
enum NeutralTag { NVar = "NVar", NApp = "NApp", }

export type Value = { tag: Tag.VAbs; env: Env; parm: Name; body: Expr.t; }
  | { tag: Tag.VNeutral; neutral: Neutral; };
export type Neutral = { tag: NeutralTag.NVar; name: Name; }
  | { tag: NeutralTag.NApp; func: Neutral; args: Value; };
export type Env = array<[Name, Value]>;


export let VAbs = (env: Env, parm: Name, body: Expr.t): Value => ({ tag: Tag.VAbs, env, parm, body });
export let VNeutral = (neutral: Neutral): Value => ({ tag: Tag.VNeutral, neutral });

export let NVar = (name: Name): Neutral => ({ tag: NeutralTag.NVar, name });
export let NApp = (func: Neutral, args: Value): Neutral => ({ tag: NeutralTag.NApp, func, args });

export let elim = <R>(v: Value, elimVLam: arrow3<Env, Name, Expr.t, R>, elimVNeutral: arrow<Neutral, R>): R => {
  switch (v.tag) {
    case Tag.VAbs: return elimVLam(v.env, v.parm, v.body);
    case Tag.VNeutral: return elimVNeutral(v.neutral);
    default: return Assert.unreachable();
  }
}
export let elimNeutral = <R>(n: Neutral, elimNVar: arrow<Name, R>, elimNApp: arrow2<Neutral, Value, R>): R => {
  switch (n.tag) {
    case NeutralTag.NVar: return elimNVar(n.name);
    case NeutralTag.NApp: return elimNApp(n.func, n.args);
    default: return Assert.unreachable();
  }
}


export let evalExpr = (env: Env, expr: Expr.t): Value => {
  return Expr.elim(expr,
    name => {
      return Maybe.fromJust(Array.lookup(env, name))
    },
    (func, args) => {
      return applyValue(evalExpr(env, func), evalExpr(env, args))
    },
    (parm, body) => {
      return VAbs(env, parm, body)
    }
  )
}

export let applyValue = (vfunc: Value, vargs: Value): Value => {
  return elim(vfunc,
    (env, parm, body) => {
      return evalExpr(Array.cons([parm, vargs], env), body)
    },
    neutral => {
      return VNeutral(NApp(neutral, vargs))
    }
  )
}

export let freshen = (free_vars: Env, name: Name): Name => {
  let fresh_name = name
  while (Array.lookup(free_vars, fresh_name) !== Maybe.Nothing) {
    fresh_name = fresh_name + "'"
  }
  return fresh_name
}

export let readback = (free_vars: Env, value: Value): Expr.t => {
  return elim(value,
    (_, parm, __) => {
      let fresh_parm = freshen(free_vars, parm)
      let v_fresh_parm = VNeutral(NVar(fresh_parm))
      let fresh_body = readback(free_vars, applyValue(value, v_fresh_parm))
      // eta expansion
      return Expr.Abs(fresh_parm, fresh_body)
    },
    neutral => { return readbackNeutral(free_vars, neutral) }
  )
}

export let readbackNeutral = (free_vars: Env, neutral: Neutral): Expr.t => {
  return elimNeutral(neutral,
    name => { return Expr.Var(name) },
    (func, args) => { return Expr.App(readbackNeutral(free_vars, func), readback(free_vars, args)) }
  )
}

export let runProgram = (defs: array<[Name, Expr.t]>, expr: Expr.t): Expr.t => {
  let env = Array.foldl<[Name, Expr.t], Env>(defs, [], (env, [name, expr]) => Array.cons([name, evalExpr(env, expr)], env))
  let val = evalExpr(env, expr)
  return readback(env, val)
}