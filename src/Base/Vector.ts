export type t = {
  readonly x: int;
  readonly y: int;
}

export let make = (x: int, y: int) : t => {
    return {x,y}
}
export let zero = make(0,0)

export let add = (a: t, b:t) : t => {
    return make(a.x + b.x, a.y + b.y)
}

export let sub = (a: t, b:t) : t => {
    return make(a.x - b.x, a.y - b.y)
}