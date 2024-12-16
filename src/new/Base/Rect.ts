import * as Vector from "./Vector"
import * as Size from "./Size"

export type Rect = {
    readonly offset : Vector.t,
    readonly size : Size.t
}
type t = Rect

export let left = (rect : t) : int => rect.offset.x
export let right = (rect : t) : int => rect.offset.x + rect.size.width
export let top = (rect : t) : int => rect.offset.y
export let bottom = (rect : t) : int => rect.offset.y + rect.size.height

export let make = (x:int,y:int,w:int,h:int) : t => {
    return {
        offset : Vector.make(x,y),
        size : Size.make(w,h)
    }
}