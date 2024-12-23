export type t = {
    readonly width: int,
    readonly height: int
}

export let make = (width: int, height: int): t => {
    return { width, height }
}
