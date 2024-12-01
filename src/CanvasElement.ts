import { Color } from './color'
import { append, cons, flat_map, flat_mapi, flatten, foldl, group, iter, map, map2, mapi, max, maximum, maximum_map, repeat, scan, sum_map } from './func'
import { Point, Size, Thickness, Grid, grid, Rect, Font, measureText, round } from './ui_base'
export * from './ui_base'
export class PositionUIElement {
    constructor(
        public offset: Point,
        public element: CanvasElement
    ) { }
}
export let position = (offset: Point, element: CanvasElement): PositionUIElement => new PositionUIElement(offset, element)

export class CanvasElement {
    constructor(
        readonly size: Size,
        readonly children: readonly PositionUIElement[]
    ) { }
}
export class Layout extends CanvasElement { }
export class Spacer extends Layout {
    constructor(size: Size) {
        super(size, [])
    }
}
export class VStack extends Layout {
    constructor(
        readonly content: readonly CanvasElement[],
        readonly spacing: number = 0,
    ) {
        let size = new Size(
            maximum_map(content, c => c.size.width),
            sum_map(content, sz => sz.size.height) + (content.length - 1) * spacing
        )
        let children: PositionUIElement[] = []
        if (content.length > 0) {
            let os = scan(content, (s, i) => new Point(s.x, s.y + i.size.height + spacing), new Point(0, 0))
            children = map2(content, os, (o, i) => position(i, o))
        }
        super(size, children)
    }
}
export class HStack extends Layout {
    constructor(
        readonly content: CanvasElement[],
        readonly spacing: number = 0,
    ) {
        let size = new Size(
            sum_map(content, sz => sz.size.width) + (content.length - 1) * spacing,
            maximum_map(content, c => c.size.height))
        let children: PositionUIElement[] = []
        if (content.length > 0) {
            let os = scan(content, (s, i) => new Point(s.x + i.size.width + spacing, s.y), new Point(0, 0))
            children = map2(content, os, (o, i) => position(i, o))
        }
        super(size, children)
    }
}
export class Margin extends Layout {
    constructor(
        readonly content: CanvasElement,
        readonly margin: Thickness
    ) {
        let size = Size.expand(content.size, margin)
        let children = [position(Point.contentLeftTop(new Point(0, 0), margin), content)]
        super(size, children)
    }
}
export let HWrap = (items: CanvasElement[], threshold: number, spacing: number = 0): CanvasElement => {
    let w = group(items,
        (acc, x) => acc + x.size.width + spacing,
        (acc, x) => acc + x.size.width > threshold, 0)
    return new VStack(w.map(row => new HStack(row, spacing)), spacing)
}
export let VWrap = (items: CanvasElement[], threshold: number, spacing: number = 0): CanvasElement => {
    let w = group(items,
        (acc, x) => acc + x.size.height + spacing,
        (acc, x) => acc + x.size.height > threshold, 0)
    return new HStack(w.map(row => new VStack(row, spacing)), spacing)
}
export class Layer extends Layout {
    constructor(
        readonly content: PositionUIElement[]
    ) {
        let size = foldl(content,
            (acc, { offset, element }) => {
                let r = new Rect(offset, element.size)
                return Size.union(acc, r.rightBottom.toOriginSize)
            }, new Size(0, 0)
        )
        let children = content
        super(size, children)
    }
}
export abstract class Renderable extends CanvasElement {
    abstract render(ctx: CanvasRenderingContext2D, origin: Point): void
}
export class Text extends Renderable {
    constructor(
        public content: string,
        public font: Font,
        public color: Color,
    ) {
        let m = measureText(content, font)
        let h = m.fontBoundingBoxAscent + m.fontBoundingBoxDescent
        let w = m.width
        let size = new Size(round(w), round(h))
        // too many decimals, will cause canvas rendering issues
        super(size, [])
    }
    render(ctx: CanvasRenderingContext2D, origin: Point) {
        ctx.fillStyle = this.color.css
        ctx.font = this.font.css
        ctx.textBaseline = "top"
        ctx.fillText(this.content, origin.x, origin.y)
        // the actual size of the text may exceed the size of the view
    }
}
export class Border extends Renderable {
    constructor(
        readonly content: CanvasElement,
        readonly border: Thickness,
        readonly color: Color
    ) {
        let size = Size.expand(content.size, border)
        let children = [position(Point.contentLeftTop(new Point(0, 0), border), content)]
        super(size, children)
    }

    render(ctx: CanvasRenderingContext2D, origin: Point) {
        ctx.fillStyle = this.color.css
        ctx.fillRect(origin.x, origin.y, this.size.width, this.size.height)
        let { x, y } = Point.contentLeftTop(origin, this.border)
        ctx.clearRect(x, y, this.content.size.width, this.content.size.height)
    }
}
export class Rectangle extends Renderable {
    constructor(
        readonly size: Size,
        readonly color: Color
    ) {
        super(size, [])
    }
    render(ctx: CanvasRenderingContext2D, origin: Point) {
        ctx.fillStyle = this.color.css
        ctx.fillRect(origin.x, origin.y, this.size.width, this.size.height)
    }
}

export let renderSequence = (origin: Point, root: CanvasElement):
    PositionUIElement[] => {
    if (origin.x < window.innerWidth && origin.y < window.innerHeight) {
        const x = position(origin, root)
        const xs = flat_map(root.children, ({ offset, element }) => {
            return renderSequence(
                Point.add(origin, offset)
                , element)
        })
        return cons(x, xs)
    } else {
        return []
    }
}


export class Padding<U extends CanvasElement> extends CanvasElement {
    constructor(
        readonly content: U,
        readonly padding: Thickness = Thickness.same(0),
        readonly background: Color = dark.control_fill.default,
    ) {
        let rect = new Rectangle(content.size, background)
        let border = new Border(new Layer([
            position(new Point(0, 0), rect),
            position(new Point(0, 0), content),
        ]), padding, background)
        super(border.size, [position(new Point(0, 0), border)])
    }
}
export interface Theme<T> {
    text_fill: {
        default: T,
        primary: T,
        secondary: T,
        tertiary: T
    },
    control_fill: {
        default: T,
        primary: T,
        secondary: T,
        tertiary: T
    },
    background: T
}
let sdark: Theme<string> = {
    text_fill: {
        default: "#ffffff",
        primary: "#cccccc",
        secondary: "#969696",
        tertiary: "#717171"
    },
    control_fill: {
        default: "#2d2d2d",
        primary: "#2d2d2d",
        secondary: "#323232",
        tertiary: "#272727"
    },
    background: "#202020"
}
let str2color = (t: Theme<string>): Theme<Color> => {
    return {
        text_fill: {
            default: new Color(t.text_fill.default),
            primary: new Color(t.text_fill.primary),
            secondary: new Color(t.text_fill.secondary),
            tertiary: new Color(t.text_fill.tertiary)
        },
        control_fill: {
            default: new Color(t.control_fill.default),
            primary: new Color(t.control_fill.primary),
            secondary: new Color(t.control_fill.secondary),
            tertiary: new Color(t.control_fill.tertiary)
        },
        background: new Color(t.background)
    }
}
export let dark = str2color(sdark)
