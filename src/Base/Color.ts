import { assert } from "../Prelude/Assert";
import { String } from "../Prelude";

export type t = Uint8Array

// don't use Visual Studio Code's color picker, it's broken
export let rgba = (r: int, g: int, b: int, a: int) : t => {
    assert(0 <= r && r <= 255 && Number.isInteger(r))
    assert(0 <= g && g <= 255 && Number.isInteger(g))
    assert(0 <= b && b <= 255 && Number.isInteger(b))
    assert(0 <= a && a <= 255 && Number.isInteger(a))

    return Uint8Array.from([r, g, b, a])
}

export let rgb = (r: int, g: int, b: int) : t => rgba(r, g, b, 255)


export let hsla = (h: int, s: int, l: int, a: int) : t => {
    let round = Math.round
    
    assert(0 <= h && h < 360 && Number.isInteger(h))
    assert(0 <= s && s <= 100 && Number.isInteger(s))
    assert(0 <= l && l <= 100 && Number.isInteger(l))
    assert(0 <= a && a <= 100 && Number.isInteger(a))

    s = s / 100
    l = l / 100
    a = a / 100

    let c = (1 - Math.abs(2 * l - 1)) * s
    let h_ = h / 60
    let x = c * (1 - Math.abs(h_ % 2 - 1))

    let r = 0
    let g = 0
    let b = 0

    switch (Math.floor(h_)) {
        case 0: r = c; g = x; b = 0; break;
        case 1: r = x; g = c; b = 0; break;
        case 2: r = 0; g = c; b = x; break;
        case 3: r = 0; g = x; b = c; break;
        case 4: r = x; g = 0; b = c; break;
        case 5: r = c; g = 0; b = x; break;
        default:
            assert(false)
            break;
    }

    let m = l - c / 2
    return Uint8Array.from([round((r + m) * 255), round((g + m) * 255), round((b + m) * 255), round(a * 255)])

}

export let hsl = (h: int, s: int, l: int) : t => hsla(h, s, l, 100)

export let toCSS = (c: t) : string => {
    let to = (x: int) => String.padding_start(x.toString(16), "0",2)
    let r = to(c[0])
    let g = to(c[1])
    let b = to(c[2])
    let a = to(c[3])
    return `#${r}${g}${b}${a}`   
}

export let white = hsl(0, 0, 100)
export let black = hsl(0, 0, 0)
export let gray  = hsl(0, 0, 50)