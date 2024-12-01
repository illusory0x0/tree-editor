import { Color, white, lightskyblue, orange } from "./color"
import { iter, foldr, foldl, map, max, maximum, append, foldri, snoc, drop } from "./func"
export type ArrayTree = string | ArrayTree[]
export let isLeaf = (t: ArrayTree) => typeof t === 'string'
export let match = <T>(
    tree: ArrayTree,
    fl: arrow<string, T>,
    fb: arrow<ArrayTree[], T>
) => {
    if (isLeaf(tree)) {
        return fl(tree)
    } else {
        return fb(tree)
    }
}
enum Style {
    Nest, 
    Apply 
}
export let NestTable = new Set<string>([
    "lambda", "define", "match"
])
export class Tree<T> {
    constructor(
        public rootLabel: T,
        public subForest: Tree<T>[],
    ) { }
    map<R>(f: arrow<T, R>): Tree<R> {
        return new Tree(f(this.rootLabel), this.subForest.map(t => t.map(f)))
    }
    iter(f: arrow<T, void>) {
        f(this.rootLabel)
        iter(this.subForest, t => t.iter(f))
    }
    clone() { return this.map(_ => _) }
    static get_access_path<T>(root: Tree<T>, pos: Tree<T>): number[] | null {
        let dfs = (cur: Tree<T>, path: number[]): number[] | null => {
            if (cur === pos) {
                return path
            } else {
                return foldri(cur.subForest, (i, e, s: number[] | null) => {
                    return dfs(e, snoc(path, i)) ?? s
                }, null
                )
            }
        }
        return dfs(root, [])
    }
    static access_via_path<T>(root: Tree<T>, path: number[]): Tree<T> | null {
        let dfs = (cur: Tree<T>, path: number[]): Tree<T> | null => {
            if (path.length === 0) {
                return cur
            } else {
                return dfs(cur.subForest[path[0]], drop(path,1))
            }
        }
        return dfs(root, path)
    }
    static parent<T>(root: Tree<T>, pos: Tree<T>): Tree<T> | null {
        let dfs = (par: Tree<T> | null, cur: Tree<T>): Tree<T> | null => {
            if (cur === pos) {
                return par
            }
            else {
                return foldr(cur.subForest,
                    (e, s: Tree<T> | null) => {
                        return dfs(cur, e) ?? s
                    }, null)
            }
        }
        return dfs(null, root)
    }
    static firstChild<T>(pos: Tree<T>): Tree<T> | null {
        return pos.subForest.length > 0 ? pos.subForest[0] : null
    }
    static sibling<T>(root: Tree<T>, pos: Tree<T>): Tree<T>[] {
        let parent = Tree.parent(root, pos)
        if (parent === null) {
            return []
        } else {
            return parent.subForest
        }
    }
    static leftSibling<T>(root: Tree<T>, pos: Tree<T>): Tree<T> | null {
        let sibling = Tree.sibling(root, pos)
        let index = sibling.indexOf(pos)
        if (index === 0) {
            return null
        } else {
            return sibling[index - 1]
        }
    }
    static rightSibling<T>(root: Tree<T>, pos: Tree<T>): Tree<T> | null {
        let sibling = Tree.sibling(root, pos)
        let index = sibling.indexOf(pos)
        if (index === sibling.length - 1) {
            return null
        }
        else {
            return sibling[index + 1]
        }
    }
    static fristLeaf<T>(tree: Tree<T>): Tree<T> {
        if (tree.subForest.length === 0) {
            return tree
        } else {
            return Tree.fristLeaf(tree.subForest[0])
        }
    }
    static delete<T>(root: Tree<T>, pos: Tree<T>): void {
        let parent = Tree.parent(root, pos)
        if (parent !== null) {
            let index = parent.subForest.indexOf(pos)
            parent.subForest.splice(index, 1)
        }
    }
    static isEmptyList = (tree: Tree<string>): boolean => {
        return tree.rootLabel === '' && tree.subForest.length === 0
    }
    static insertBefore<T>(root: Tree<T>, pos: Tree<T>, newTree: Tree<T>): void {
        let parent = Tree.parent(root, pos)
        if (parent !== null) {
            let index = parent.subForest.indexOf(pos)
            parent.subForest.splice(index, 0, newTree)
        }
    }
    static insertAfter<T>(root: Tree<T>, pos: Tree<T>, newTree: Tree<T>): void {
        let parent = Tree.parent(root, pos)
        if (parent !== null) {
            let index = parent.subForest.indexOf(pos)
            parent.subForest.splice(index + 1, 0, newTree)
        }
    }
    static group(root: Tree<string>, pos: Tree<string>): void {
        let parent = Tree.parent(root, pos)
        if (parent !== null) {
            let index = parent.subForest.indexOf(pos)
            parent.subForest.splice(index, 1, new Tree('', [pos]))
        }
    }
    static ungroup(root: Tree<string>, pos: Tree<string>): void {
        let parent = Tree.parent(root, pos)
        if (parent !== null && parent.subForest.length === 1) {
            let pparent = Tree.parent(root, parent)
            if (pparent !== null) {
                let index = pparent.subForest.indexOf(parent)
                pparent.subForest.splice(index, 1, ...parent.subForest)
            }
        }
    }
    static appendChild(root: Tree<string>, pos: Tree<string>, newTree: Tree<string>): void {
        if (pos.rootLabel.length === 0) {
            pos.subForest.push(newTree)
        } else {
            let parent = Tree.parent(root, pos)
            if (parent !== null) {
                parent.subForest.push(newTree)
            }
        }
    }
}
export class ColorText {
    constructor(
        public text: string,
        public color: Color
    ) { }
    static colorize(s: string): Color {
        let color = white
        if (!Number.isNaN(Number.parseInt(s)) || s === "nil") {
            color = new Color('#DF7EFB')
        }
        if (NestTable.has(s)) {
            color = lightskyblue
        }
        if (s.length >= 2 && s[0] === '"' && s[s.length - 1] === '"') {
            color = orange
        }
        return color
    }
}
export let toTree = (t: ArrayTree): Tree<string> => {
    return match(t,
        (s) => new Tree(s, []),
        (ts) => {
            let rootLabel = ""
            let subForest = ts.map(toTree)
            return new Tree(rootLabel, subForest)
        }
    )
}
export let toArrayTree = (t: Tree<string>): ArrayTree => {
    if (t.subForest.length === 0) {
        if (t.rootLabel.length === 0) {
            return []
        } else {
            return t.rootLabel
        }
    } else {
        return map(t.subForest, toArrayTree)
    }
}
export type Text = ColorText | Tree<string>
export class Line {
    constructor(
        public indentation: number,
        public texts: Text[],
    ) { }
    indent(n: number): Line {
        return new Line(this.indentation + n, this.texts)
    }
    get width() {
        return foldl(
            this.texts,
            (acc, a) =>
                acc + (a instanceof ColorText ? a.text.length : 0),
            this.indentation
        )
    }
    static cons(s: Text, l: Line): Line {
        return new Line(l.indentation, [s, ...l.texts])
    }
    static snoc(l: Line, s: Text): Line {
        return new Line(l.indentation, [...l.texts, s])
    }
    static append(lhs: Line, rhs: Line): Line {
        return new Line(
            lhs.indentation,
            [...lhs.texts, ...rhs.texts]
        )
    }
}


export type Doc = Line[]
export let bracketColorTable = [
    Color.fromHSL(0, 100, 60),
    Color.fromHSL(180, 100, 60),
    Color.fromHSL(240, 100, 70),
    Color.fromHSL(60, 100, 50),
    Color.fromHSL(300, 100, 50),
    Color.fromHSL(120, 100, 50),
]
export let bracket = (depth: number, doc: Doc): Doc => {
    let color = bracketColorTable[depth % bracketColorTable.length]
    let lb = new ColorText('(', color)
    let rb = new ColorText(')', color)
    let cons = Line.cons
    let snoc = Line.snoc
    if (doc.length === 0) {
        return [new Line(0, [lb, rb])]
    }
    else if (doc.length === 1) {
        let f = doc[0]
        return [cons(lb, snoc(f, rb))]
    } else { 
        let f = doc[0]
        let m = doc.slice(1, doc.length - 1)
        let b = doc[doc.length - 1]
        return [cons(lb, f), ...m, snoc(b, rb)]
    }
}
export let joinLine = (top: Doc, bottom: Doc): Doc => {
    let space = new ColorText(' ', white)
    let cons = Line.cons
    let append = Line.append
    if (top.length === 0) {
        return bottom
    } else if (bottom.length === 0) {
        return top
    } else {
        let top_init = top.slice(0, top.length - 1)
        let top_last = top[top.length - 1]
        let bottom_head = bottom[0]
        let bottom_tail = bottom.slice(1, bottom.length)
        let middle = append(top_last, cons(space, bottom_head))
        bottom_tail = map(bottom_tail, (e) =>
            e.indent(top_last.width + 1))
        return [...top_init, middle, ...bottom_tail]
    }
}
export let indentRest = (doc: Doc): Doc => {
    if (doc.length === 0) {
        return []
    } else {
        let x = doc[0]
        let xs = doc.slice(1, doc.length)
        return [x, ...map(xs, (e) => e.indent(1))]
    }
}
export let measureLastLineWidth =
    (doc: Doc) => {
        if (doc.length === 0) {
            return 0
        } else {
            let lastLine = doc[doc.length - 1]
            return lastLine.width
        }
    }
export let summarize = (doc: Doc[]): number => {
    return foldl(doc, (acc1, e) =>
        foldl(e, (acc2, e) => acc2 + e.width, acc1)
        , 0)
}
export let measureWidth = (doc: Doc): number => {
    return foldl(doc, (acc1, e) => max(acc1, e.width), 0)
}
export let separatWithSpace = (doc: Doc): Doc => {
    let space = new ColorText(' ', white)
    let result: Text[] = []
    if (doc.length === 0) {
        result = []
    } else if (doc.length === 1) {
        let x = doc[0]
        result = x.texts
    } else {
        let x = doc[0]
        let xs = doc.slice(1, doc.length)
        result = foldl(xs, (acc, e) => Line.append(acc, Line.cons(space, e)), x).texts
    }
    return [new Line(0, result)]
}
export let arrange = (depth: number, tag: Style, xs: Doc[]): Doc => {
    let lineBreakBracket = (doc: Doc) => {
        return indentRest(bracket(depth, doc))
    }
    let indentLines = (n: number, doc: Doc) => {
        return map(doc, (e) => e.indent(n))
    }
    if (xs.length === 0) {
        return lineBreakBracket([])
    } else if (xs.length === 1) {
        let x = xs[0]
        return lineBreakBracket(x)
    } else {
        if (summarize(xs) > 50) {
            let x1 = xs[0]
            let x2 = xs[1]
            let rest = xs.slice(2, xs.length)
            let restIndentation = null
            if (tag === Style.Nest) {
                restIndentation = 1
            }
            else {
                restIndentation = 0
                restIndentation = measureLastLineWidth(x1) + 1
            }
            let maxwidth = maximum(xs.map(measureWidth))
            let threshold = 80
            if (
                maxwidth + measureWidth(x1) < threshold &&
                maxwidth + measureWidth(x2) < threshold
            ) {
                return lineBreakBracket(
                    append(
                        joinLine(x1, x2),
                        indentLines(restIndentation, rest.flat())
                    )
                )
            } else {
                return lineBreakBracket(xs.flat())
            }
        }
        else {
            return lineBreakBracket(separatWithSpace(xs.flat()))
        }
    }
}
export let foldTree = <A, B>(
    tree: Tree<A>,
    depth: number,
    f: arrow3<number, Tree<A>, B[], B>
): B => {
    return f(depth, tree,
        map(tree.subForest, (x) => foldTree(x, depth + 1, f)))
}
export let add_selection_anchor = (tree: Tree<string>, doc: Doc): Doc => {
    if (doc.length === 0) {
        return [new Line(0, [tree, tree])]
    } else if (doc.length === 1) {
        let x = doc[0]
        return [Line.cons(tree, Line.snoc(x, tree))]
    } else {
        let head = doc[0]
        let middle = doc.slice(1, doc.length - 1)
        let last = doc[doc.length - 1]
        return [Line.cons(tree, head), ...middle, Line.snoc(last, tree)]
    }
}
export let format = (tree: Tree<string>): Doc => {
    return foldTree(tree, 0, (depth, t, xs): Doc => {
        let ts = t.subForest
        if (ts.length !== 0) {
            let rootLabel = Style.Apply
            let x = ts[0].rootLabel
            if (NestTable.has(x)) {
                rootLabel = Style.Nest
            }
            return add_selection_anchor(t, arrange(depth, rootLabel, xs))
        } else if (t.rootLabel.length !== 0) {
            let x = new ColorText(t.rootLabel, ColorText.colorize(t.rootLabel))
            return add_selection_anchor(t, [new Line(0, [x])])
        } else {
            return add_selection_anchor(t, arrange(depth, Style.Apply, xs))
        }
    })
}
export let t: ArrayTree =
    ["lambda", ["x"],
        ["lambda", ["x"],
            ["lambda", ["x"],
                ["lambda", ["x"],
                    ["+", "1", "2", "3", "4"]]]]]
export let t_map: ArrayTree =
    ["define", ["map", "f", "lst"],
        ["match", "lst",
            [["nil"], "nil"],
            [["cons", "h", "t"], ["cons", ["f", "h"], ["map", "f", "t"]]]
        ]]
export let t_app: ArrayTree =
    ["foldr",
        ["lambda", ["x", "y"], ["append-string", "x", "y"]],
        "nil",
        ["list", "1", "2", "3", "4", "5"]
    ]
export let t_list = ["list", "1", "2", "3"]
export let t_bracket: ArrayTree = [[[[[[[[[[[[[]]]]]]]]]]]]]