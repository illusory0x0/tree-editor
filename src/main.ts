import '../index.css'

let flat_map = <A, B>(xs: A[], f: arrow<A, B[]>): B[] =>
    xs.flatMap(f)

let flat_mapi = <A, B>(xs: A[], f: arrow2<number, A, B[]>): B[] =>
    xs.flatMap((x, i) => f(i, x))

let map = <A, B>(xs: A[], f: arrow<A, B>): B[] =>
    xs.map(f)

let mapi = <A, B>(xs: A[], f: arrow2<number, A, B>): B[] =>
    xs.map((x, i) => f(i, x))

let filter = <A>(xs: A[], f: arrow<A, boolean>): A[] =>
    xs.filter(f)

let iter = <A>(xs: A[], f: arrow<A, void>): void =>
    xs.forEach(f)

let repeat = <A>(x: A, n: number): A[] =>
    Array(n).fill(x)

let head = <A>(xs: A[]): A =>
    xs[0]
let tail = <A>(xs: A[]): A[] =>
    xs.slice(1)

let init = <A>(xs: A[]): A[] =>
    xs.slice(0, xs.length - 1)

let last = <A>(xs: A[]): A =>
    xs[xs.length - 1]

let scan = <A, B>(xs: A[], f: arrow2<B, A, B>, z: B): B[] => {
    let acc = z
    let w = [acc]
    for (let x of xs) {
        acc = f(acc, x)
        w.push(acc)
    }
    return w
}

let map2 = <A, B, C>(xs: A[], ys: B[], f: arrow2<A, B, C>): C[] => {
    if (xs.length > ys.length) {
        throw new Error(`expected xs.length <= ys.length, but a.length == ${xs.length}, b.length == ${ys.length}`)
    }
    let w = []
    for (let i = 0; i < xs.length; i++) {
        w.push(f(xs[i], ys[i]))
    }
    return w
}

let group = <A, B>(
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

let flatten = <A>(xs: A[][]): A[] =>
    xs.flat()

let foldl = <A, B>(xs: A[], f: arrow2<B, A, B>, z: B): B =>
    xs.reduce(f, z)

let foldr = <A, B>(xs: A[], f: arrow2<A, B, B>, z: B): B =>
    xs.reduceRight((s, e) => f(e, s), z)

let sum_map = <A>(xs: A[], f: arrow<A, number>): number =>
    foldl(xs, (s, e) => s + f(e), 0)

let maximum_max = <A>(xs: A[], f: arrow<A, number>) =>
    foldl(xs, (s, e) => Math.max(s, f(e)), -Infinity)

let length = <A>(xs: A[]): number => xs.length


class Stopwatch {
    constructor(
    ) { }
    private startTime: number = 0
    private endTime: number = 0

    start() {
        this.startTime = Date.now()
    }
    stop() {
        this.endTime = Date.now()
    }

    get elapsed() {
        return this.endTime - this.startTime
    }
}

let measureExecuteTime = (msg: string, f: arrow<void, void>) => {
    let sw = new Stopwatch()
    sw.start()
    f()
    sw.stop()
    console.log(`${msg}: ${sw.elapsed}ms`)
}

let query = <T extends Element>(selector: string) =>
    document.querySelector<T>(selector)!

let canvas = query<HTMLCanvasElement>("#canvas")
let composition = query<HTMLDivElement>("#composition")

let resize = () => {
    let dpr = window.devicePixelRatio
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`
    canvas.getContext("2d")!.scale(dpr, dpr)
}

let renderingContext2D = document.createElement('canvas').getContext('2d')!

let measureText = (text: string, font: Font) => {
    let ctx = renderingContext2D
    ctx.font = font.css
    return ctx.measureText(text)
}

class Color {
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

//#region
let aliceblue = new Color("#f0f8ff")
let antiquewhite = new Color("#faebd7")
let aqua = new Color("#00ffff")
let aquamarine = new Color("#7fffd4")
let azure = new Color("#f0ffff")
let beige = new Color("#f5f5dc")
let bisque = new Color("#ffe4c4")
let black = new Color("#000000")
let blanchedalmond = new Color("#ffebcd")
let blue = new Color("#0000ff")
let blueviolet = new Color("#8a2be2")
let brown = new Color("#a52a2a")
let burlywood = new Color("#deb887")
let cadetblue = new Color("#5f9ea0")
let chartreuse = new Color("#7fff00")
let chocolate = new Color("#d2691e")
let coral = new Color("#ff7f50")
let cornflowerblue = new Color("#6495ed")
let cornsilk = new Color("#fff8dc")
let crimson = new Color("#dc143c")
let cyan = new Color("#00ffff")
let darkblue = new Color("#00008b")
let darkcyan = new Color("#008b8b")
let darkgoldenrod = new Color("#b8860b")
let darkgray = new Color("#a9a9a9")
let darkgreen = new Color("#006400")
let darkgrey = new Color("#a9a9a9")
let darkkhaki = new Color("#bdb76b")
let darkmagenta = new Color("#8b008b")
let darkolivegreen = new Color("#556b2f")
let darkorange = new Color("#ff8c00")
let darkorchid = new Color("#9932cc")
let darkred = new Color("#8b0000")
let darksalmon = new Color("#e9967a")
let darkseagreen = new Color("#8fbc8f")
let darkslateblue = new Color("#483d8b")
let darkslategray = new Color("#2f4f4f")
let darkslategrey = new Color("#2f4f4f")
let darkturquoise = new Color("#00ced1")
let darkviolet = new Color("#9400d3")
let deeppink = new Color("#ff1493")
let deepskyblue = new Color("#00bfff")
let dimgray = new Color("#696969")
let dimgrey = new Color("#696969")
let dodgerblue = new Color("#1e90ff")
let firebrick = new Color("#b22222")
let floralwhite = new Color("#fffaf0")
let forestgreen = new Color("#228b22")
let fuchsia = new Color("#ff00ff")
let gainsboro = new Color("#dcdcdc")
let ghostwhite = new Color("#f8f8ff")
let gold = new Color("#ffd700")
let goldenrod = new Color("#daa520")
let gray = new Color("#808080")
let green = new Color("#008000")
let greenyellow = new Color("#adff2f")
let grey = new Color("#808080")
let honeydew = new Color("#f0fff0")
let hotpink = new Color("#ff69b4")
let indianred = new Color("#cd5c5c")
let indigo = new Color("#4b0082")
let ivory = new Color("#fffff0")
let khaki = new Color("#f0e68c")
let lavender = new Color("#e6e6fa")
let lavenderblush = new Color("#fff0f5")
let lawngreen = new Color("#7cfc00")
let lemonchiffon = new Color("#fffacd")
let lightblue = new Color("#add8e6")
let lightcoral = new Color("#f08080")
let lightcyan = new Color("#e0ffff")
let lightgoldenrodyellow = new Color("#fafad2")
let lightgray = new Color("#d3d3d3")
let lightgreen = new Color("#90ee90")
let lightgrey = new Color("#d3d3d3")
let lightpink = new Color("#ffb6c1")
let lightsalmon = new Color("#ffa07a")
let lightseagreen = new Color("#20b2aa")
let lightskyblue = new Color("#87cefa")
let lightslategray = new Color("#778899")
let lightslategrey = new Color("#778899")
let lightsteelblue = new Color("#b0c4de")
let lightyellow = new Color("#ffffe0")
let lime = new Color("#00ff00")
let limegreen = new Color("#32cd32")
let linen = new Color("#faf0e6")
let magenta = new Color("#ff00ff")
let maroon = new Color("#800000")
let mediumaquamarine = new Color("#66cdaa")
let mediumblue = new Color("#0000cd")
let mediumorchid = new Color("#ba55d3")
let mediumpurple = new Color("#9370db")
let mediumseagreen = new Color("#3cb371")
let mediumslateblue = new Color("#7b68ee")
let mediumspringgreen = new Color("#00fa9a")
let mediumturquoise = new Color("#48d1cc")
let mediumvioletred = new Color("#c71585")
let midnightblue = new Color("#191970")
let mintcream = new Color("#f5fffa")
let mistyrose = new Color("#ffe4e1")
let moccasin = new Color("#ffe4b5")
let navajowhite = new Color("#ffdead")
let navy = new Color("#000080")
let oldlace = new Color("#fdf5e6")
let olive = new Color("#808000")
let olivedrab = new Color("#6b8e23")
let orange = new Color("#ffa500")
let orangered = new Color("#ff4500")
let orchid = new Color("#da70d6")
let palegoldenrod = new Color("#eee8aa")
let palegreen = new Color("#98fb98")
let paleturquoise = new Color("#afeeee")
let palevioletred = new Color("#db7093")
let papayawhip = new Color("#ffefd5")
let peachpuff = new Color("#ffdab9")
let peru = new Color("#cd853f")
let pink = new Color("#ffc0cb")
let plum = new Color("#dda0dd")
let powderblue = new Color("#b0e0e6")
let purple = new Color("#800080")
let rebeccapurple = new Color("#663399")
let red = new Color("#ff0000")
let rosybrown = new Color("#bc8f8f")
let royalblue = new Color("#4169e1")
let saddlebrown = new Color("#8b4513")
let salmon = new Color("#fa8072")
let sandybrown = new Color("#f4a460")
let seagreen = new Color("#2e8b57")
let seashell = new Color("#fff5ee")
let sienna = new Color("#a0522d")
let silver = new Color("#c0c0c0")
let skyblue = new Color("#87ceeb")
let slateblue = new Color("#6a5acd")
let slategray = new Color("#708090")
let slategrey = new Color("#708090")
let snow = new Color("#fffafa")
let springgreen = new Color("#00ff7f")
let steelblue = new Color("#4682b4")
let tan = new Color("#d2b48c")
let teal = new Color("#008080")
let thistle = new Color("#d8bfd8")
let tomato = new Color("#ff6347")
let transparent = Color.fromRGBA(0, 0, 0, 0)
let turquoise = new Color("#40e0d0")
let violet = new Color("#ee82ee")
let wheat = new Color("#f5deb3")
let white = new Color("#ffffff")
let whitesmoke = new Color("#f5f5f5")
let yellow = new Color("#ffff00")
let yellowgreen = new Color("#9acd32")
//#endregion

enum FontStyle {
    Normal = 'normal',
    Italic = 'italic'
}

enum GenericFontFamily {
    Serif = 'serif',
    SansSerif = 'sans-serif',
    Monospace = 'monospace',
    Cursive = 'cursive',
    Fantasy = 'fantasy',
    SystemUI = 'system-ui',
    UISerif = 'ui-serif',
    UISansSerif = 'ui-sans-serif',
    UIMonospace = 'ui-monospace',
    UIRounded = 'ui-rounded',
    Math = 'math',
    Emoji = 'emoji',
    FangSong = 'FangSong'
}

class Font {
    constructor(
        public fontFamily: string[],
        public genericFontFamily: GenericFontFamily[],
        public fontSize: number,
        public style: FontStyle = FontStyle.Normal,
        public weight: number = 400,
        public lineHeight: number = 1.2,
    ) { }

    get css(): string {

        let f = this.fontFamily.map(f => `"${f}"`).concat(this.genericFontFamily)
        //  String values must be quoted but may contain any Unicode character.
        // https://developer.mozilla.org/en-US/docs/Web/CSS/font-family#values

        return `${this.style} ${this.weight} ${this.fontSize}px ${f}`

        // Generic family names are keywords and must not be quoted. 
        // https://developer.mozilla.org/en-US/docs/Web/CSS/font-family#generic-name
    }
}


class Size {
    constructor(
        public width: number,
        public height: number
    ) { }

    static union(a: Size, b: Size): Size {
        return new Size(Math.max(a.width, b.width), Math.max(a.height, b.height))
    }
    static empty = new Size(0, 0)


    static expand(size: Size, thickness: Thickness) {
        return new Size(
            size.width + thickness.left + thickness.right,
            size.height + thickness.top + thickness.bottom
        );
    }
    static shrink(size: Size, margin: Thickness) {
        return new Size(
            size.width - margin.left - margin.right,
            size.height - margin.top - margin.bottom
        )
    }
}


class Point {
    constructor(
        public x: number,
        public y: number
    ) { }
    static add(a: Point, b: Point): Point {
        return new Point(a.x + b.x, a.y + b.y)
    }
    get toOriginSize(): Size {
        return new Size(this.x, this.y)
    }

    static empty = new Point(0, 0)
    static contentLeftTop(point: Point, thickness: Thickness): Point {
        return new Point(
            point.x + thickness.left,
            point.y + thickness.top
        )
    }

    inside(r: Rect): boolean {
        return this.x >= r.x && this.x <= r.x + r.width
            && this.y >= r.y && this.y <= r.y + r.height
    }
}

class Rect {
    constructor(
        public pos: Point = Point.empty,
        public size: Size = Size.empty
    ) { }

    get x(): number { return this.pos.x }
    get y(): number { return this.pos.y }
    get width(): number { return this.size.width }
    get height(): number { return this.size.height }

    get leftTop(): Point { return this.pos }
    get rightTop(): Point {
        return new Point(this.pos.x + this.size.width, this.pos.y)
    }
    get leftBottom(): Point {
        return new Point(this.pos.x, this.pos.y + this.size.height)
    }
    get rightBottom(): Point { return new Point(this.pos.x + this.size.width, this.pos.y + this.size.height) }

    static fromXYWH(x: number, y: number, width: number, height: number): Rect {
        return new Rect(new Point(x, y), new Size(width, height))
    }

}


class Thickness {
    constructor(
        public left: number,
        public top: number,
        public right: number,
        public bottom: number
    ) { }

    static same(value: number): Thickness {
        return new Thickness(value, value, value, value
        )
    }
    static empty = new Thickness(0, 0, 0, 0)
}

enum HorizontalAlignment {
    Left,
    Center,
    Right
}

enum VerticalAlignment {
    Top,
    Center,
    Bottom
}


enum Alignment {
    LeftTop,
    LeftCenter,
    LeftBottom,
    CenterTop,
    Center,
    CenterBottom,
    RightTop,
    RightCenter,
    RightBottom
}

function destructAlignment(alignment: Alignment): [HorizontalAlignment, VerticalAlignment] {
    switch (alignment) {
        case Alignment.LeftTop: return [HorizontalAlignment.Left, VerticalAlignment.Top]
        case Alignment.LeftCenter: return [HorizontalAlignment.Left, VerticalAlignment.Center]
        case Alignment.LeftBottom: return [HorizontalAlignment.Left, VerticalAlignment.Bottom]

        case Alignment.CenterTop: return [HorizontalAlignment.Center, VerticalAlignment.Top]
        case Alignment.Center: return [HorizontalAlignment.Center, VerticalAlignment.Center]
        case Alignment.CenterBottom: return [HorizontalAlignment.Center, VerticalAlignment.Bottom]

        case Alignment.RightTop: return [HorizontalAlignment.Right, VerticalAlignment.Top]
        case Alignment.RightCenter: return [HorizontalAlignment.Right, VerticalAlignment.Center]
        case Alignment.RightBottom: return [HorizontalAlignment.Right, VerticalAlignment.Bottom]
    }
}



let calculateOrigin = (
    origin: Point,
    containerSize: Size,
    contentSize: Size,
    horizontalAlignment: HorizontalAlignment,
    verticalAlignment: VerticalAlignment) => {

    let remainingWidth = containerSize.width - contentSize.width
    let remainingHeight = containerSize.height - contentSize.height

    switch (horizontalAlignment) {
        case HorizontalAlignment.Left: break;
        case HorizontalAlignment.Center:
            origin = new Point(origin.x + remainingWidth / 2, origin.y)

            break;
        case HorizontalAlignment.Right:
            origin = new Point(origin.x + remainingWidth, origin.y)
            break;
    }
    switch (verticalAlignment) {
        case VerticalAlignment.Top: break;
        case VerticalAlignment.Center:
            origin = new Point(origin.x, origin.y + remainingHeight / 2)
            break;
        case VerticalAlignment.Bottom:
            origin = new Point(origin.x, origin.y + remainingHeight)
            break;
    }
    return origin
}



class Grid {
    constructor(
        public row: number,
        public col: number
    ) { }

    toString() { return `(${this.row},${this.col})` }

}

let grid = (row: number, col: number): Grid => new Grid(row, col)

class PositionUIElement {
    constructor(
        public offset: Point,
        public element: UIElement
    ) { }
}

let position = (pos: Point, element: UIElement): PositionUIElement => new PositionUIElement(pos, element)


interface UIElement {
    size: Size
    children: PositionUIElement[]
}

interface Layout extends UIElement { }






























class Spacer implements Layout {
    constructor(public size: Size) { }

    children = []
    static Empty = new Spacer(Size.empty)
}

class VStack implements Layout {
    constructor(
        public items: UIElement[],
        public spacing: number = 0,
    ) {


    }

    get size() {
        let items = this.items
        let spacing = this.spacing

        return new Size(
            maximum_max(items, c => c.size.width),
            sum_map(items, sz => sz.size.height) + (items.length - 1) * spacing)
    }

    get children() {
        let items = this.items
        let spacing = this.spacing

        if (items.length == 0) {
            return []
        } else {
            let os = scan(items, (s, i) => new Point(s.x, s.y + i.size.height + spacing), Point.empty)
            return map2(items, os, (o, i) => position(i, o))
        }
    }

}
// impl HStack 

class HStack implements Layout {
    constructor(
        public items: UIElement[],
        public spacing: number = 0,
    ) { }

    get size() {
        let items = this.items
        let spacing = this.spacing

        return new Size(
            sum_map(items, sz => sz.size.width) + (items.length - 1) * spacing,
            maximum_max(items, c => c.size.height))

    }
    get children() {
        let items = this.items
        let spacing = this.spacing

        if (items.length == 0) {
            return []
        } else {
            let os = scan(items, (s, i) => new Point(s.x + i.size.width + spacing, s.y), Point.empty)
            return map2(items, os, (o, i) => position(i, o))
        }
    }
}

class Margin implements Layout {
    constructor(
        public content: UIElement,
        public margin: Thickness
    ) { }

    get size() {
        return Size.expand(this.content.size, this.margin)
    }
    get children() {
        let offset = Point.contentLeftTop(Point.empty, this.margin)

        return [position(offset, this.content)]
    }

}



class Align implements Layout {
    constructor(
        public content: UIElement,
        public size: Size,
        public alignment: Alignment
    ) { }

    get children() {
        let [ha, va] = destructAlignment(this.alignment)
        let offset = calculateOrigin(Point.empty, this.size, this.content.size, ha, va)

        return [position(offset, this.content)]
    }



}


type GridItem = [Grid, UIElement]
type GridItems = GridItem[]

class UniformGrid implements Layout {
    constructor(
        public items: GridItems,
        public itemSize: Size,
        public rows: number,
        public cols: number,
    ) { }

    get children() {

        let m = new Map(map(this.items,
            ([key, val]) => {
                return [key.toString(), val] as [string, UIElement]
            }
        ))

        let w: PositionUIElement[] = []

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                let item = m.get(grid(row, col).toString()) ?? Spacer.Empty
                let itemOrigin = new Point(
                    col * (this.itemSize.width),
                    row * (this.itemSize.height))
                w.push(position(itemOrigin, item))
            }
        }
        return w
    }

    get size() {
        let itemSize = this.itemSize

        return new Size(
            this.cols * itemSize.width,
            this.rows * itemSize.height
        )
    }
}



let HWrap = (items: UIElement[], threshold: number, spacing: number = 0): UIElement => {

    let w = group(items,
        (acc, x) => acc + x.size.width + spacing,
        (acc, x) => acc + x.size.width > threshold, 0)

    return new VStack(w.map(row => new HStack(row, spacing)), spacing)
}


let VWarp = (items: UIElement[], threshold: number, spacing: number = 0): UIElement => {

    let w = group(items,
        (acc, x) => acc + x.size.height + spacing,
        (acc, x) => acc + x.size.height > threshold, 0)
    return new HStack(w.map(row => new VStack(row, spacing)), spacing)
}


class Layer implements Layout {
    constructor(
        public items: PositionUIElement[]
    ) {

    }
    get size() {
        return foldl(this.items,
            (acc, { offset, element }) => {
                let r = new Rect(offset, element.size)
                return Size.union(acc, r.rightBottom.toOriginSize)
            }, Size.empty
        )
    }
    get children() {
        return map(this.items, ({ offset, element }) => position(offset, element))
    }
}



abstract class Renderable implements UIElement {
    abstract render(ctx: CanvasRenderingContext2D, origin: Point): void
    abstract size: Size

    abstract children: PositionUIElement[]
}

class RawText extends Renderable {
    constructor(
        public text: string,
        public font: Font,
        public color: Color,
    ) { super() }

    get size() {
        let m = measureText(this.text, this.font)
        let h = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent
        let w = m.width
        return new Size(w, h)
    }
    get children() { return [] }

    render(ctx: CanvasRenderingContext2D, origin: Point) {
        ctx.fillStyle = this.color.css
        ctx.font = this.font.css
        ctx.textBaseline = "top"
        ctx.fillText(this.text, origin.x, origin.y)
    }

    // the actual size of the text may exceed the size of the view
    // so you add border for this view, you should use Margin as parent view
}

class Border extends Renderable {
    constructor(
        public content: UIElement,
        public border: Thickness,
        public color: Color
    ) { super() }

    get children() {
        let offset = Point.contentLeftTop(Point.empty, this.border)
        return [position(offset, this.content)]

    }
    get size() { return Size.expand(this.content.size, this.border) }

    render(ctx: CanvasRenderingContext2D, origin: Point) {
        ctx.fillStyle = this.color.css

        ctx.fillRect(origin.x, origin.y, this.size.width, this.size.height)
        let { x, y } = Point.contentLeftTop(origin, this.border)
        ctx.clearRect(x, y, this.content.size.width, this.content.size.height)
    }

}


let Text = (text: string, font: Font, color: Color) =>
    new Margin(new RawText(text, font, color), Thickness.same(font.fontSize / 10))

class Rectangle extends Renderable {
    constructor(
        public size: Size,
        public color: Color
    ) {
        super()
    }
    get children() { return [] }

    render(ctx: CanvasRenderingContext2D, origin: Point) {
        ctx.fillStyle = this.color.css
        // console.log(this)
        ctx.fillRect(origin.x, origin.y, this.size.width, this.size.height)
    }
}

let BorderGrid = (
    items: GridItems,
    itemSize: Size,
    rows: number,
    cols: number,
    thickness: number,
    color: Color) => {
    return new Border(
        new UniformGrid(
            map(items, ([grid, element]) =>
                [grid, new Align(
                    new Border(
                        element,
                        Thickness.same(thickness),
                        color),
                    itemSize, Alignment.Center)
                ])
            ,
            itemSize,
            rows,
            cols,
        ), Thickness.same(thickness), color)
}





