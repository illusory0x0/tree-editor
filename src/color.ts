
export class Color {
    constructor(public css: string) { }
    static fromRGB(r: number, g: number, b: number): Color {
        return new Color(`rgb(${r}, ${g}, ${b})`);
    }
    static fromRGBA(r: number, g: number, b: number, a: number): Color {
        return new Color(`rgba(${r}, ${g}, ${b}, ${a})`);
    }
    static fromHSL(h: number, s: number, l: number): Color {
        return new Color(`hsl(${h}, ${s}%, ${l}%)`);
    }
    static fromHSLA(h: number, s: number, l: number, a: number): Color {
        return new Color(`hsla(${h}, ${s}%, ${l}%, ${a})`);
    }
}
//#region Color table
export let aliceblue = new Color("#f0f8ff")
export let antiquewhite = new Color("#faebd7")
export let aqua = new Color("#00ffff")
export let aquamarine = new Color("#7fffd4")
export let azure = new Color("#f0ffff")
export let beige = new Color("#f5f5dc")
export let bisque = new Color("#ffe4c4")
export let black = new Color("#000000")
export let blanchedalmond = new Color("#ffebcd")
export let blue = new Color("#0000ff")
export let blueviolet = new Color("#8a2be2")
export let brown = new Color("#a52a2a")
export let burlywood = new Color("#deb887")
export let cadetblue = new Color("#5f9ea0")
export let chartreuse = new Color("#7fff00")
export let chocolate = new Color("#d2691e")
export let coral = new Color("#ff7f50")
export let cornflowerblue = new Color("#6495ed")
export let cornsilk = new Color("#fff8dc")
export let crimson = new Color("#dc143c")
export let cyan = new Color("#00ffff")
export let darkblue = new Color("#00008b")
export let darkcyan = new Color("#008b8b")
export let darkgoldenrod = new Color("#b8860b")
export let darkgray = new Color("#a9a9a9")
export let darkgreen = new Color("#006400")
export let darkgrey = new Color("#a9a9a9")
export let darkkhaki = new Color("#bdb76b")
export let darkmagenta = new Color("#8b008b")
export let darkolivegreen = new Color("#556b2f")
export let darkorange = new Color("#ff8c00")
export let darkorchid = new Color("#9932cc")
export let darkred = new Color("#8b0000")
export let darksalmon = new Color("#e9967a")
export let darkseagreen = new Color("#8fbc8f")
export let darkslateblue = new Color("#483d8b")
export let darkslategray = new Color("#2f4f4f")
export let darkslategrey = new Color("#2f4f4f")
export let darkturquoise = new Color("#00ced1")
export let darkviolet = new Color("#9400d3")
export let deeppink = new Color("#ff1493")
export let deepskyblue = new Color("#00bfff")
export let dimgray = new Color("#696969")
export let dimgrey = new Color("#696969")
export let dodgerblue = new Color("#1e90ff")
export let firebrick = new Color("#b22222")
export let floralwhite = new Color("#fffaf0")
export let forestgreen = new Color("#228b22")
export let fuchsia = new Color("#ff00ff")
export let gainsboro = new Color("#dcdcdc")
export let ghostwhite = new Color("#f8f8ff")
export let gold = new Color("#ffd700")
export let goldenrod = new Color("#daa520")
export let gray = new Color("#808080")
export let green = new Color("#008000")
export let greenyellow = new Color("#adff2f")
export let grey = new Color("#808080")
export let honeydew = new Color("#f0fff0")
export let hotpink = new Color("#ff69b4")
export let indianred = new Color("#cd5c5c")
export let indigo = new Color("#4b0082")
export let ivory = new Color("#fffff0")
export let khaki = new Color("#f0e68c")
export let lavender = new Color("#e6e6fa")
export let lavenderblush = new Color("#fff0f5")
export let lawngreen = new Color("#7cfc00")
export let lemonchiffon = new Color("#fffacd")
export let lightblue = new Color("#add8e6")
export let lightcoral = new Color("#f08080")
export let lightcyan = new Color("#e0ffff")
export let lightgoldenrodyellow = new Color("#fafad2")
export let lightgray = new Color("#d3d3d3")
export let lightgreen = new Color("#90ee90")
export let lightgrey = new Color("#d3d3d3")
export let lightpink = new Color("#ffb6c1")
export let lightsalmon = new Color("#ffa07a")
export let lightseagreen = new Color("#20b2aa")
export let lightskyblue = new Color("#87cefa")
export let lightslategray = new Color("#778899")
export let lightslategrey = new Color("#778899")
export let lightsteelblue = new Color("#b0c4de")
export let lightyellow = new Color("#ffffe0")
export let lime = new Color("#00ff00")
export let limegreen = new Color("#32cd32")
export let linen = new Color("#faf0e6")
export let magenta = new Color("#ff00ff")
export let maroon = new Color("#800000")
export let mediumaquamarine = new Color("#66cdaa")
export let mediumblue = new Color("#0000cd")
export let mediumorchid = new Color("#ba55d3")
export let mediumpurple = new Color("#9370db")
export let mediumseagreen = new Color("#3cb371")
export let mediumslateblue = new Color("#7b68ee")
export let mediumspringgreen = new Color("#00fa9a")
export let mediumturquoise = new Color("#48d1cc")
export let mediumvioletred = new Color("#c71585")
export let midnightblue = new Color("#191970")
export let mintcream = new Color("#f5fffa")
export let mistyrose = new Color("#ffe4e1")
export let moccasin = new Color("#ffe4b5")
export let navajowhite = new Color("#ffdead")
export let navy = new Color("#000080")
export let oldlace = new Color("#fdf5e6")
export let olive = new Color("#808000")
export let olivedrab = new Color("#6b8e23")
export let orange = new Color("#ffa500")
export let orangered = new Color("#ff4500")
export let orchid = new Color("#da70d6")
export let palegoldenrod = new Color("#eee8aa")
export let palegreen = new Color("#98fb98")
export let paleturquoise = new Color("#afeeee")
export let palevioletred = new Color("#db7093")
export let papayawhip = new Color("#ffefd5")
export let peachpuff = new Color("#ffdab9")
export let peru = new Color("#cd853f")
export let pink = new Color("#ffc0cb")
export let plum = new Color("#dda0dd")
export let powderblue = new Color("#b0e0e6")
export let purple = new Color("#800080")
export let rebeccapurple = new Color("#663399")
export let red = new Color("#ff0000")
export let rosybrown = new Color("#bc8f8f")
export let royalblue = new Color("#4169e1")
export let saddlebrown = new Color("#8b4513")
export let salmon = new Color("#fa8072")
export let sandybrown = new Color("#f4a460")
export let seagreen = new Color("#2e8b57")
export let seashell = new Color("#fff5ee")
export let sienna = new Color("#a0522d")
export let silver = new Color("#c0c0c0")
export let skyblue = new Color("#87ceeb")
export let slateblue = new Color("#6a5acd")
export let slategray = new Color("#708090")
export let slategrey = new Color("#708090")
export let snow = new Color("#fffafa")
export let springgreen = new Color("#00ff7f")
export let steelblue = new Color("#4682b4")
export let tan = new Color("#d2b48c")
export let teal = new Color("#008080")
export let thistle = new Color("#d8bfd8")
export let tomato = new Color("#ff6347")
export let transparent = Color.fromRGBA(0, 0, 0, 0)
export let turquoise = new Color("#40e0d0")
export let violet = new Color("#ee82ee")
export let wheat = new Color("#f5deb3")
export let white = new Color("#ffffff")
export let whitesmoke = new Color("#f5f5f5")
export let yellow = new Color("#ffff00")
export let yellowgreen = new Color("#9acd32")
//#endregion