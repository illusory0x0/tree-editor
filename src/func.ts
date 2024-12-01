export let flat_map = <A, B>(xs: readonly A[], f: arrow<A, B[]>): B[] =>
    xs.flatMap(f)
export let flat_mapi = <A, B>(xs: readonly A[], f: arrow2<number, A, B[]>): B[] =>
    xs.flatMap((x, i) => f(i, x))
export let map = <A, B>(xs: readonly A[], f: arrow<A, B>): B[] =>
    xs.map(f)
export let mapi = <A, B>(xs: readonly A[], f: arrow2<number, A, B>): B[] =>
    xs.map((x, i) => f(i, x))
export let filter = <A>(xs: readonly A[], f: arrow<A, boolean>): A[] =>
    xs.filter(f)
export let splitAt = <A>(xs: readonly A[], n: number): [A[], A[]] =>
    [xs.slice(0, n), xs.slice(n)]
export let take = <A>(xs: readonly A[], n: number): A[] =>
    xs.slice(0, n)
export let drop = <A>(xs: readonly A[], n: number): A[] =>
    xs.slice(n)
export let drop_last = <A>(xs: readonly A[], n: number): A[] =>
    xs.slice(0, xs.length - n)
export let take_last = <A>(xs: readonly A[], n: number): A[] =>
    xs.slice(n, xs.length)
// mutable function
export let iter = <A>(xs: A[], f: arrow<A, void>): void =>
    xs.forEach(f)
export let repeat = <A>(x: A, n: number): A[] =>
    Array(n).fill(x)
export let cons = <A>(x: A, xs: A[]): A[] =>
    [x, ...xs]
export let snoc = <A>(xs: A[], x: A): A[] =>
    [...xs, x]
export let append = <A>(xs: A[], ys: A[]): A[] =>
    [...xs, ...ys]
export let scan = <A, B>(xs: readonly A[], f: arrow2<B, A, B>, z: B): B[] => {
    let acc = z
    let w = [acc]
    for (let x of xs) {
        acc = f(acc, x)
        w.push(acc)
    }
    return w
}
export let swap = <A>(lhs: A, rhs: A): void => {
    let tmp = lhs
    lhs = rhs
    rhs = tmp
}
export let map2 = <A, B, C>(xs: readonly A[], ys: readonly B[], f: arrow2<A, B, C>): C[] => {
    if (xs.length > ys.length) {
        throw new Error(`expected xs.length <= ys.length, but a.length == ${xs.length}, b.length == ${ys.length}`)
    }
    let w = []
    for (let i = 0; i < xs.length; i++) {
        w.push(f(xs[i], ys[i]))
    }
    return w
}
export let group = <A, B>(
    xs: A[],
    f: arrow2<B, A, B>,
    p: arrow2<B, A, boolean>,
    z: B): A[][] => {
    let acc = z
    let w: A[][] = [[]]
    for (let x of xs) {
        if (p(acc, x)) {
            w.push([])
            acc = z
        }
        acc = f(acc, x)
        w[w.length - 1].push(x)
    }
    return w
}
export let flatten = <A>(xs: A[][]): A[] =>
    xs.flat()
export let foldl = <A, B>(xs: readonly A[], f: arrow2<B, A, B>, z: B): B =>
    xs.reduce(f, z)
export let foldr = <A, B>(xs: A[], f: arrow2<A, B, B>, z: B): B =>
    xs.reduceRight((s, e) => f(e, s), z)
export let foldri = <A, B>(xs: readonly A[], f: arrow3<number, A, B,B>, z: B): B =>
    xs.reduce((s, e, i) => f(i, e, s), z)
export let foldli = <A, B>(xs: readonly A[], f: arrow3<number, A, B,B>, z: B): B =>
    xs.reduce((s, e, i) => f(i, e, s), z)
export let sum_map = <A>(xs: readonly A[], f: arrow<A, number>): number =>
    foldl(xs, (s, e) => s + f(e), 0)
export let maximum_map = <A>(xs: readonly A[], f: arrow<A, number>) =>
    foldl(xs, (s, e) => Math.max(s, f(e)), -Infinity)
export let maximum = (xs: number[]) =>
    foldl(xs, (s, e) => Math.max(s, e), -Infinity)
export let max = (lhs: number, rhs: number): number =>
    Math.max(lhs, rhs)
export let min = (lhs: number, rhs: number): number =>
    Math.min(lhs, rhs)
export let length = <A>(xs: A[]): number => xs.length
export let sort = <A>(xs: A[], f: arrow2<A, A, boolean>): A[] =>
    xs.slice().sort((a, b) => f(a, b) ? -1 : 1)
