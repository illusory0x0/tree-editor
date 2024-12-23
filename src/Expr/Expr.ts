import { array, Array, Assert, Maybe } from "../Prelude";
import { foldr } from "../Prelude/Array";

export enum Tag { Var = "Var", App = "App", Abs = "Abs" }

export type Name = string

export type t = { tag: Tag.Var; name: Name; }
  | { tag: Tag.App; func: t; args: t; }
  | { tag: Tag.Abs; parm: t; body: t; };


export let Var = (name: string): t => ({ tag: Tag.Var, name });
export let App = (func: t, args: t): t => ({ tag: Tag.App, func, args });
export let Abs = (parm: string, body: t): t => ({ tag: Tag.Abs, parm: Var(parm), body });



export let elim = <R>(e: t, elimVar: arrow<Name, R>, elimApp: arrow2<t, t, R>, elimAbs: arrow2<Name, t, R>): R => {
  switch (e.tag) {
    case Tag.Var: return elimVar(e.name);
    case Tag.App: return elimApp(e.func, e.args);
    case Tag.Abs: if (e.parm.tag === Tag.Var) return elimAbs(e.parm.name, e.body); else return Assert.unreachable();
    default: return Assert.unreachable();
  }
}

export let elim2 = <R>(e: t, elimVar: arrow<Name, R>, elimApp: arrow2<t, t, R>, elimAbs: arrow2<t, t, R>): R => {
  switch (e.tag) {
    case Tag.Var: return elimVar(e.name);
    case Tag.App: return elimApp(e.func, e.args);
    case Tag.Abs: return elimAbs(e.parm, e.body)
    default: return Assert.unreachable();
  }
}


export let equal = (e1: t, e2: t): boolean => {
  return elim(e1,
    name1 => elim(e2,
      name2 => name1 === name2,
      (_, __) => false,
      (_, __) => false
    ),
    (func1, args1) => elim(e2,
      _ => false,
      (func2, args2) => equal(func1, func2) && equal(args1, args2),
      (_, __) => false
    ),
    (parm1, body1) => elim(e2,
      _ => false,
      (_, __) => false,
      (parm2, body2) => parm1 === parm2 && equal(body1, body2)
    )
  )
}

export let parent = (pos: t, root: t): Maybe.t<t> => {
  let go = (par: Maybe.t<t>, cur: t): Maybe.t<t> => {
    if (cur === pos) {
      return par
    } else {
      return elim2(cur,
        _ => Maybe.Nothing,
        (func, args) => go(cur, func) ?? go(cur, args),
        (parm, body) => go(cur, parm) ?? go(cur, body)
      )
    }
  }
  return go(Maybe.Nothing, root)
}

export let firstLeaf = (root : t ) : t => { 
  return elim2(root, 
    _ => root,
    (func, args ) => { return firstLeaf(func) },
    (parm , body ) => { return firstLeaf(parm ) }
  )
}
