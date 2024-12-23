import * as Maybe from "./Maybe"
type t<a> = readonly a[]

export type array<a> = t<a>

//#region Construction
export let empty: t<any> = []
export let append = <a>(xs: t<a>, yx: t<a>) => xs.concat(yx)
export let cons = <a>(x: a, xs: t<a>) => [x, ...xs]
export let snoc = <a>(xs: t<a>, x: a) => [...xs, x]
export let reverse = <a>(xs: t<a>) => xs.slice().reverse()
export let replicate = <a>(n: number, x: a) => Array(n).fill(x)
export let sort = <a>(xs: t<a>) => xs.slice().sort()
export let sortBy = <a>(xs: t<a>, f: arrow2<a, a, ordering>) => xs.slice().sort(f)
//#endregion

//#region Queries
export let isEmpty = <a>(xs: t<a>) => xs.length === 0
export let length = <a>(xs: t<a>) => xs.length
export let lookup = <a, b>(xs: t<[a, b]>, e: a) : Maybe.t<b> => xs.find(([x, _]) => x === e)?.[1]
//#endregion


//#region Sub Array
export let head = <a>(xs: t<a>) => xs[0]
export let tail = <a>(xs: t<a>) => xs.slice(1)
export let last = <a>(xs: t<a>) => xs[xs.length - 1]
export let init = <a>(xs: t<a>) => xs.slice(0, xs.length - 1)

export let take = <a>(xs: t<a>, n: number) => xs.slice(0, n)
export let drop = <a>(xs: t<a>, n: number) => xs.slice(n)
export let splitAt = <a>(xs: t<a>, n: number) => [take(xs, n), drop(xs, n)]
export let slice = <a>(xs: t<a>, from: number, to: number) => xs.slice(from, to)
//#endregion

//#region Folding
export let filter = <a>(xs: t<a>, f: arrow<a, boolean>,) => xs.filter(f)
export let foldl = <a, b>(xs: t<a>, z: b, f: arrow2<b, a, b>) => xs.reduce(f, z)
export let foldr = <a, b>(xs: t<a>, z: b, f: arrow2<a, b, b>) => xs.reduceRight((s, e) => f(e, s), z)

export let scanl = <a, b>(xs: t<a>, z: b, f: arrow2<b, a, b>): t<b> => {
  let acc = z
  let accs = [z]
  for (let x of xs) {
    acc = f(acc, x)
    accs.push(acc)
  }
  return accs
}

export let scanr = <a, b>(xs: t<a>, z: b, f: arrow2<a, b, b>): t<b> => {
  let acc = z
  let accs = []
  for (let i = xs.length - 1; i >= 0; i--) {
    acc = f(xs[i], acc)
    accs.push(acc)
  }
  accs.push(z)
  return accs
}

export let groupl = <a, b>(xs: t<a>, z: b, f: arrow2<b, a, b>, p: arrow2<b, a, boolean>) => {
  let acc = z
  let g: a[] = []
  let gs: a[][] = []

  for (let x of xs) {
    if (!p(acc, x)) {
      gs.push(g)
      g = []
    }
    acc = f(acc, x)
    g.push(x)
  }
  gs.push(g)
  return gs
}
//#endregion

//#region Mapping
export let map = <a, b>(xs: t<a>, f: arrow<a, b>) => xs.map(f)
export let mapi = <a, b>(xs: t<a>, f: arrow2<number, a, b>) => xs.map((x, i) => f(i, x))
export let zipWith = <a, b, c>(xs: t<a>, ys: t<b>, f: arrow2<a, b, c>) => xs.map((x, i) => f(x, ys[i]))
export let mapMaybes = <a, b>(xs: t<a>, f: arrow<a, Maybe.t<b>>) => xs.map(f).filter(x => x !== Maybe.Nothing) as b[]
//#endregion

//#region Monadic
export let flatten = <a>(xss: t<t<a>>): t<a> => xss.flat()
export let flatMap = <a, b>(xs: t<a>, f: arrow<a, t<b>>): t<b> => xs.flatMap(f)
//#endregion

//#region Destruction
export let elimBidirectional = <a, b>(xs: t<a>, z: b, f: arrow<a, b>, g: arrow3<a, t<a>, a, b>): b => {
  if (isEmpty(xs)) { return z }
  if (xs.length === 1) { return f(head(xs)) }
  return g(head(xs), slice(xs, 1, xs.length - 1), last(xs))
}
//#endregion

export let sumMap = <a>(xs: t<a>, f: arrow<a, number>) => foldl(xs, 0, (s, e) => s + f(e))
export let maximumMap = <a>(xs: t<a>, f: arrow<a, number>) => foldl(xs, -Infinity, (s, e) => Math.max(s, f(e)))
export let minimumMap = <a>(xs: t<a>, f: arrow<a, number>) => foldl(xs, Infinity, (s, e) => Math.min(s, f(e)))


export let iter = <a>(xs: t<a>, f: arrow<a, void>) => xs.forEach(f)
export let iteri = <a>(xs: t<a>, f: arrow2<number, a, void>) => xs.forEach((x, i) => f(i, x))