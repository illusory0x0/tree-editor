export type t = {
    readonly left: int,
    readonly top: int,
    readonly right: int,
    readonly bottom: int
}

export let make = (left: int, top: int, right: int, bottom: int): t => {
    return { left, top, right, bottom }
}

export let same = (n: int) => make(n, n, n, n)