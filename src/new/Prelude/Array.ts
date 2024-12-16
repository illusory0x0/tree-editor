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
//#endregion

//#region Queries
export let isEmpty = <a>(xs: t<a>) => xs.length === 0
export let length = <a>(xs: t<a>) => xs.length
//#endregion


//#region Sub Array
export let head = <a>(xs: t<a>) => xs[0]
export let tail = <a>(xs: t<a>) => xs.slice(1)
export let last = <a>(xs: t<a>) => xs[xs.length - 1]
export let init = <a>(xs: t<a>) => xs.slice(0, xs.length - 1)

export let take = <a>(n: number, xs: t<a>) => xs.slice(0, n)
export let drop = <a>(n: number, xs: t<a>) => xs.slice(n)
export let splitAt = <a>(n: number, xs: t<a>) => [take(n, xs), drop(n, xs)]
export let slice = <a>(from: number, to: number, xs: t<a>) => xs.slice(from, to)
//#endregion

//#region Folding
export let filter = <a>(f: arrow<a, boolean>, xs: t<a>) => xs.filter(f)
export let foldl = <a, b>(f: arrow2<b, a, b>, z: b, xs: t<a>) => xs.reduce(f, z)
export let foldr = <a, b>(f: arrow2<a, b, b>, z: b, xs: t<a>) => xs.reduceRight((s, e) => f(e, s), z)

export let scanl = <a, b>(f: arrow2<b, a, b>, z: b, xs: t<a>) : t<b> => {
    let acc = z 
    let accs = [z]
    for (let x of xs) {
        acc = f(acc, x)
        accs.push(acc)
    }
    return accs
}

export let scanr = <a, b>(f: arrow2<a, b, b>, z: b, xs: t<a>) : t<b> => {
    let acc = z
    let accs = []
    for(let i = xs.length - 1; i >= 0; i--) {
        acc = f(xs[i], acc)
        accs.push(acc)
    }
    accs.push(z)
    return accs 
}

export let groupl = <a,b>(f: arrow2<b, a, b>, p: arrow2<b,a,boolean>, z: b, xs: t<a>) => {
    let acc = z
    let g : a[] = []
    let gs : a[][] = []

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
export let map = <a, b>(f: arrow<a, b>, xs: t<a>) => xs.map(f)
export let mapi = <a, b>(f: arrow2<number, a, b>, xs: t<a>) => xs.map((x, i) => f(i, x))
export let zipWith = <a, b, c>(f: arrow2<a, b, c>, xs: t<a>, ys: t<b>) => xs.map((x, i) => f(x, ys[i]))
//#endregion

//#region Monadic
export let flatten = <a>(xss: t<t<a>>): t<a> => xss.flat()
export let flatMap = <a, b>(f: arrow<a, t<b>>, xs: t<a>): t<b> => xs.flatMap(f)
//#endregion

//#region Destruction
export let elimBidirectional = <a, b>(z: b, f: arrow<a, b>, g: arrow3<a, t<a>, a, b>, xs: t<a>): b => {
    if (isEmpty(xs)) { return z }
    if (xs.length === 1) { return f(head(xs)) }
    return g(head(xs), slice(1, xs.length - 1, xs), last(xs))
}
//#endregion

export let sumMap = <a>(f: arrow<a, number>, xs: t<a>) => foldl((s, e) => s + f(e), 0, xs)
export let maximumMap = <a>(f: arrow<a, number>, xs: t<a>) => foldl((s, e) => Math.max(s, f(e)), -Infinity, xs)
export let minimumMap = <a>(f: arrow<a, number>, xs: t<a>) => foldl((s, e) => Math.min(s, f(e)), Infinity, xs)


export let iter = <a>(f: arrow<a, void>, xs: t<a>) => xs.forEach(f)
export let iteri = <a>(f: arrow2<number, a, void>, xs: t<a>) => xs.forEach((x, i) => f(i, x))