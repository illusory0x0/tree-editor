
export let renderingContext2D = document.createElement('canvas').getContext('2d')!
export let round = (n: number) => Math.round(n)
export let measureText = (text: string, font: Font) => {
    let ctx = renderingContext2D
    ctx.font = font.css
    return ctx.measureText(text)
}
export enum FontStyle {
    Normal = 'normal',
    Italic = 'italic'
}
export enum GenericFontFamily {
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
export class Font {
    constructor(
        readonly fontFamily: string[],
        readonly genericFontFamily: GenericFontFamily[],
        readonly fontSize: number,
        readonly style: FontStyle = FontStyle.Normal,
        readonly weight: number = 400,
        readonly lineHeight: number = 1.2,
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
export class Size {
    constructor(
        readonly width: number,
        readonly height: number
    ) { }
    static union(a: Size, b: Size): Size {
        return new Size(Math.max(a.width, b.width), Math.max(a.height, b.height))
    }
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
export class Point {
    constructor(
        readonly x: number,
        readonly y: number
    ) { }
    static add(a: Point, b: Point): Point {
        return new Point(a.x + b.x, a.y + b.y)
    }
    get toOriginSize(): Size {
        return new Size(this.x, this.y)
    }
    static middle(a: Point, b: Point): Point {
        return new Point((a.x + b.x) / 2, (a.y + b.y) / 2)
    }
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
export class Rect {
    constructor(
        readonly pos: Point,
        readonly size: Size
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
    contains(p: Point): boolean {
        return p.inside(this)
    }
}
export class Thickness {
    constructor(
        readonly left: number,
        readonly top: number,
        readonly right: number,
        readonly bottom: number
    ) { }
    static same(value: number): Thickness {
        return new Thickness(value, value, value, value
        )
    }
}
export class Grid {
    constructor(
        readonly row: number,
        readonly col: number
    ) { }
    toString() { return `(${this.row},${this.col})` }
}
export let grid = (row: number, col: number): Grid => new Grid(row, col)