import { Color, red, green, blue, yellow, magenta, purple, pink, cyan, orange, white, gray, lime, aqua, lightcoral, mediumorchid, lightskyblue, darkkhaki, mediumspringgreen, salmon, plum, mediumpurple, gold, lightpink, fuchsia, grey } from './color'
import { append, cons, drop, drop_last, filter, flat_map, flat_mapi, flatten, foldl, foldr, group, iter, map, map2, mapi, max, maximum, maximum_map, repeat, scan, sort, splitAt, sum_map, take } from './func'
import {
    dark,
    Border, Font, FontStyle, GenericFontFamily, grid, HStack, HWrap, Layer, Margin, Point, position, PositionUIElement, Text as TextElement, Rectangle, Size, Thickness, CanvasElement, VStack, VWrap,
    Renderable,
    renderSequence,
    Grid,
    Spacer,
    Padding,
    round
} from './CanvasElement'
import { Tree, ColorText, toTree, format, t_map, Doc, ArrayTree, toArrayTree } from './format'
import { isomorphism_Node_SelectionRegion, SelectionRegion, generate_isomorphism_Cursor_Node, from_LeafNode_to_Cursor, Node, generate_isomorphism_Node_SelectionRegion } from './isomorphism_Node_SelectionRegion'
import { canvas, composition, anchor } from './Global'


export let resize = () => {
    let dpr = window.devicePixelRatio
    dpr = round(dpr) + 1
    // too many decimals, will cause canvas rendering issues
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`
    canvas.getContext("2d")!.scale(dpr, dpr)
}
let render = (renderSequence: PositionUIElement[]) => {
    let ctx = canvas.getContext("2d")!
    ctx.fillStyle = dark.background.css
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    iter(renderSequence, ({ offset, element }) => {
        if (element instanceof Renderable &&
            offset.x < window.innerWidth && offset.y < window.innerHeight
        ) {
            element.render(ctx, offset)
        }
    })
}
canvas.addEventListener('focus', () => {
    composition.focus()
})

let monospace = new Font(
    ["Cascadia Mono"],
    [GenericFontFamily.Monospace],
    10,
    FontStyle.Normal,
    320
)
let empty_element = position(new Point(0, 0), new Spacer(new Size(0, 0)))

let docElement = (doc: Doc): VStack => {

    let content = map(doc, line => {
        let indentation = repeat(' ', line.indentation).join('')
        let content = filter(line.texts, text => text instanceof ColorText) as ColorText[]
        return new HStack(
            [
                new TextElement(indentation, monospace, white)
                ,
                ...map(content, span => new TextElement(span.text, monospace, span.color),)
            ],
        )
    })
    return new VStack(content)
}

let selectionRegionElement = (doc_element: VStack, selection: SelectionRegion, color: Color) => {
    let [start, end] = selection
    let sum_width = (xs: readonly CanvasElement[]) => sum_map(xs, x => x.size.width)
    let max_height = (xs: readonly CanvasElement[]) => maximum_map(xs, x => x.size.height)
    if (start.row == end.row) {
        let hstack = doc_element.content[start.row] as HStack
        let offset = new Point(hstack.children[start.col].offset.x, doc_element.children[start.row].offset.y)
        let content = take(drop(hstack.content, start.col), end.col - start.col)
        let rectangle = new Rectangle(
            new Size(
                sum_width(content),
                max_height(content)
            ),
            color
        )
        return position(offset, rectangle)
    }
    else {
        let offset = doc_element.children[start.row].offset
        let [head_line_spacer_size, head_line_rectangle_size] =
            splitAt((doc_element.content[start.row] as HStack).content, start.col)
        let head_line = new HStack(
            [
                new Spacer(new Size(
                    sum_width(head_line_spacer_size),
                    max_height(head_line_spacer_size)
                )),
                new Rectangle(
                    new Size(
                        sum_width(head_line_rectangle_size),
                        max_height(drop(head_line_rectangle_size, start.col))
                    ),
                    color
                )
            ]
        )
        let middle_lines = map(
            take(drop(doc_element.content, start.row + 1), end.row - start.row - 1 ),
            line => new Rectangle(line.size, color))
            
        // TODO 
        let last_line_size = take((doc_element.content[end.row] as HStack).content,end.col)
        let last_line = new Rectangle(
            new Size(
                sum_width(last_line_size),
                max_height(last_line_size)
            ),
            color
        )
        return position(offset, new VStack([head_line, ...middle_lines,last_line]))
    }
}


export class Cursor {
    constructor(
        readonly matrix: Node[][],
        public grid_ref: Grid = new Grid(0, 0)
    ) {
    }
    private get ylen() { return this.matrix.length }
    private get xlen() { return this.matrix[this.row].length }
    get row() { return this.grid_ref.row }
    get col() { return this.grid_ref.col }
    moveLeft() {
        this.grid_ref = new Grid(this.row, this.col > 0 ? this.col - 1 : this.col);
    }
    moveRight() {
        this.grid_ref = new Grid(this.row, this.col < this.xlen - 1 ? this.col + 1 : this.col);
    }
    moveUp() {
        this.grid_ref = new Grid(this.row > 0 ? this.row - 1 : this.row, this.col);
        this._set_proper_x()
    }
    moveDown() {
        this.grid_ref = new Grid(this.row < this.ylen - 1 ? this.row + 1 : this.row, this.col);
        this._set_proper_x()
    }
    private _set_proper_x() {
        this.grid_ref = new Grid(this.row, this.col < this.xlen ? this.grid_ref.col : this.xlen - 1)
    }
    get current() {
        return this.matrix[this.row][this.col]
    }
}
let selection_color = grey
export enum EditMode { Replace, Normal, KeepReplace, Insert }

let isInputBoxVisible = (m: EditMode) => m === EditMode.Insert || m === EditMode.KeepReplace || m === EditMode.Replace



class InputBox {
    constructor(
        public ref: PositionUIElement
    ) { }
    text = ""

    static create(
        offset: Point,
        text: string,
        completion_list: string[] = [],
        completion_index: number = 1
    ) {
        let body = new Border(
            new Padding(
                new TextElement(text, monospace, ColorText.colorize(text)),
                Thickness.same(2),
            )
            ,
            Thickness.same(0.2),
            white
        )
        let completion = new Border(
            new VStack(
                mapi(completion_list, (i, text) => {
                    let padding_color = i === completion_index ? selection_color : dark.background
                    return new Padding(
                        new TextElement(text, monospace, ColorText.colorize(text)),
                        Thickness.same(2),
                        padding_color
                    )
                })
            ),
            Thickness.same(0.2),
            white
        )
        return position(offset,
            new VStack([
                body,
                completion
            ])
        )
    }
    static offset(matrix: VStack, start: Grid) {
        let hstack = matrix.content[start.row] as HStack
        let offset = new Point(hstack.children[start.col].offset.x, matrix.children[start.row].offset.y)
        let size = hstack.content[start.col].size
        return new Point(offset.x, offset.y + size.height)
    }

    update(offset: Point, text: string, completion_list: string[], completion_index: number) {
        this.ref = InputBox.create(
            offset,
            text,
            completion_list,
            completion_index
        )
    }
    hide() {
        this.ref = empty_element
    }
    backspace() {
        this.text = this.text.slice(0, -1)
    }
    append(str: string) {
        this.text += str
    }

}


export class Editor {
    constructor(t: ArrayTree) {
        this.root = toTree(t)
        this.current = this.root
        this.doc = format(this.root)
        this.doc_ui = docElement(this.doc)
        this.iso_map = generate_isomorphism_Node_SelectionRegion(this.doc)
        this.cursor = new Cursor(generate_isomorphism_Cursor_Node(this.iso_map))
        this.append_completion_set()
    }
    inputBox: InputBox = new InputBox(empty_element)

    root: Node
    current: Node
    editMode: EditMode = EditMode.Normal
    register: Node = new Tree('?', [])
    //#region undo operation
    private _undo_stack: [Node, number[]][] = []
    save() {
        let state: [Node, number[]] = [this.root.clone(), Tree.get_access_path(this.root, this.current)!]
        this._undo_stack.push(state)
    }
    restore() {
        if (this._undo_stack.length > 0) {
            let [root, path] = this._undo_stack.pop()!
            this.root = root
            this.current = Tree.access_via_path(this.root, path)!
            this.update_doc()
        }
    }

    switchReplaceMode() {
        if (this.current.subForest.length === 0) {
            this.editMode = EditMode.Replace
            this.update_inputbox()
        }
    }
    switchInsertMode() {
        if (this.current.subForest.length === 0) {
            this.editMode = EditMode.Insert
            this.update_inputbox()
        }
    }
    switchKeepReplaceMode() {
        if (this.current.subForest.length === 0) {
            this.editMode = EditMode.KeepReplace
            this.update_inputbox()
        }
    }
    //#endregion
    //#region modify operation
    accept_input() {
        this.editMode = EditMode.Normal
        this.inputBox.hide()
        this.save()
        this.current.rootLabel = this.input_result
        this.inputBox.text = ''
        this.update_doc()
    }
    discard_input() {
        this.editMode = EditMode.Normal
        this.inputBox.hide()
        this.inputBox.text = ''
    }

    backspace() {
        this.inputBox.backspace()
        this.update_inputbox()
    }

    inputbox_append(s: string) {
        this.inputBox.append(s)
        this.update_inputbox()
    }

    delete() {
        this.save()
        if (this.current !== this.root) {
            let deleted = this.current
            this.current = Tree.rightSibling(this.root, this.current) ??
                Tree.leftSibling(this.root, this.current) ??
                Tree.parent(this.root, this.current)!
            Tree.delete(this.root, deleted)
            this.register = deleted
            this.update_doc()
            this.current = Tree.fristLeaf(this.current)
        } else {
            this.register = this.root.clone()
            this.current = this.root
            this.root.subForest = []
            this.update_doc()
        }
    }
    ungroup() {
        this.save()
        Tree.ungroup(this.root, this.current)
        this.update_doc()
    }
    group() {
        this.save()
        Tree.group(this.root, this.current)
        this.update_doc()
    }
    insert_after(newNode: Node) {
        this.save()
        Tree.insertAfter(this.root, this.current, newNode)
        this.update_doc()
    }
    insert_before(newNode: Node) {
        this.save()
        Tree.insertBefore(this.root, this.current, newNode)
        this.update_doc()
    }
    appendChild() {
        this.save()
        Tree.appendChild(this.root, this.current, new Tree('?', []))
        this.update_doc()
    }
    //#endregion
    get selection() {
        return this.iso_map.get(this.current)!
    }
    static empty_list() {
        return new Tree('', [])
    }
    static place_holder() {
        return new Tree('?', [])
    }
    moveLeft() {
        this.cursor.moveLeft()
        this.current = this.cursor.current
    }
    moveRight() {
        this.cursor.moveRight()
        this.current = this.cursor.current
    }
    moveUp() {

        let [start, _] = this.selection
        let y = this.doc_ui.children[start.row].offset.y

        if (y < window.innerHeight / 2) {
            this.update_doc()
            console.log('update block')
        }

        this.cursor.moveUp()
        this.current = this.cursor.current
    }
    moveDown() {
        let [start, _] = this.selection
        let y = this.doc_ui.children[start.row].offset.y

        if (y > window.innerHeight / 2) {
            this.update_doc()
            console.log('update block')
        }

        this.cursor.moveDown()
        this.current = this.cursor.current
    }
    selectParent() {
        this.current = Tree.parent(this.root, this.current) ?? this.current
    }
    selectLeftSibling() {
        this.current = Tree.leftSibling(this.root, this.current) ?? this.current
    }
    selectRightSibling() {
        this.current = Tree.rightSibling(this.root, this.current) ?? this.current
    }
    selectFirstChild() {
        this.current = Tree.firstChild(this.current) ?? this.current
    }
    update_inputbox() {
        let start = this.selection[0]
        let offset = InputBox.offset(this.doc_ui, start)
        this.inputBox.ref =
            InputBox.create(
                offset,
                this.inputBox.text,
                this.inputBox.text.length === 0 ? [] : this.completion_list,
                this.completion_index)
    }

    update_selection(color: Color) {
        let selection = this.iso_map.get(this.current)!
        this.selection_uiref = selectionRegionElement(this.doc_ui, selection, color)
    }
    restoreCursor() {
        this.cursor.grid_ref = from_LeafNode_to_Cursor(this.cursor.matrix, Tree.fristLeaf(this.current)) ?? this.cursor.grid_ref
    }
    max_line = 100
    update_doc() {

        let ft = this.current

        for (let i = 0; i < 10; ++i) {
            let tmp = Tree.parent(this.root, ft)
            if (tmp == null) break; else ft = tmp

        }

        this.doc = take(format(ft), this.max_line)

        //#region count leaf
        let leaf_num = 0
        this.root.iter(leaf => {
            if (leaf !== "") {

                ++leaf_num
            }
        }
        )
        console.log(`leaf num: ${leaf_num}`)
        //#endregion


        this.doc_ui = docElement(this.doc)
        this.iso_map = generate_isomorphism_Node_SelectionRegion(this.doc)
        this.cursor = new Cursor(generate_isomorphism_Cursor_Node(this.iso_map))
        this.append_completion_set()
        this.restoreCursor()
    }
    append_completion_set() {
        this.root.iter(text => {
            if (text.length !== 0 && text !== '?') {
                this.completion_set.add(text)
            }
        })
    }
    //#region auto completion
    completion_set: Set<string> = new Set()
    completion_index = 0
    next_completion() {
        this.completion_index = (this.completion_index + 1) % this.completion_list.length
        this.update_inputbox()
    }
    prev_completion() {
        this.completion_index = (this.completion_index - 1 + this.completion_list.length) % this.completion_list.length
        this.update_inputbox()
    }
    get input_result() {
        let lst = this.completion_list
        return lst.length === 0 ? this.inputBox.text : lst[this.completion_index]
    }
    get completion_list() {
        let lst = [this.inputBox.text]

        for (let x of this.completion_set) {
            lst.push(x)
        }
        return filter(lst, text => text.includes(this.inputBox.text))
    }
    //#endregion

    cursor: Cursor
    doc: Doc
    doc_ui: VStack
    selection_uiref = empty_element
    iso_map: isomorphism_Node_SelectionRegion
}
export let editor = new Editor(t_map)

export let updateView = () => {
    // render(renderSequence(new Point(10, 10),
    //     new Layer(
    //         [
    //             editor.selection_uiref,
    //             position(new Point(0, 0), editor.doc_ui),
    //             editor.inputBox.ref,
    //         ]
    //     )))
}
let modifier_keys = new Set(['Control', 'Shift', 'Alt'])



export let composition_before_text = ''

export let compositionCapture = (
    on_start: (e: CompositionEvent) => void,
    on_update: (e: CompositionEvent) => void,
    on_end: ((e: CompositionEvent) => void) | null = null) => {
    composition.addEventListener('compositionstart', on_start)
    composition.addEventListener('compositionupdate', on_update)
    composition.addEventListener('compositionend', (e) => {
        composition.innerHTML = ''
        on_end?.(e)
    })
}




window.addEventListener('keydown', (e) => {

    if (e.key === "Tab") {
        e.preventDefault()
        composition.focus()
    }
    // guards jump 
    if (modifier_keys.has(e.key)) { return }
    if (e.isComposing   ) { return }


    editor.update_selection(dark.background)
    if (isInputBoxVisible(editor.editMode)) {
        if (e.key.length === 1) {
            editor.inputbox_append(e.key)
        } else if (e.key === 'Backspace') {
            editor.backspace()
        } else if (e.key === 'Enter') {
            if (editor.editMode === EditMode.KeepReplace) {
                editor.accept_input()
                editor.moveRight()
                editor.switchKeepReplaceMode()
            } if (editor.editMode === EditMode.Replace) {
                editor.accept_input()
            } else if (editor.editMode === EditMode.Insert) {
                editor.accept_input()
                editor.insert_after(Editor.place_holder())
                editor.moveRight()
                editor.switchInsertMode()
            }
        } else if (e.key === 'Escape') {
            editor.discard_input()
        }
        else if (e.key === 'ArrowUp') {
            editor.prev_completion()
        } else if (e.key === 'ArrowDown') {
            editor.next_completion()
        }
    } else if (editor.editMode === EditMode.Normal) {
        if (e.key === 'L') {
            editor.selectParent()
        } else if (e.key === 'H') {
            editor.selectFirstChild()
        } else if (e.key === 'J') {
            editor.selectLeftSibling()
        } else if (e.key === 'K') {
            editor.selectRightSibling()
        } else if (e.key === 'h') {
            editor.moveLeft()
        } else if (e.key === 'j') {
            editor.moveDown()
        } else if (e.key === 'k') {
            editor.moveUp()
        } else if (e.key === 'l') {
            editor.moveRight()
        }
        else if (e.key === 'd') {
            editor.delete()
        } else if (e.key === 'r') {
            editor.switchReplaceMode()
        } else if (e.key === 'R') {
            editor.switchKeepReplaceMode()
        } else if (e.key === 'i') {
            editor.insert_before(Editor.place_holder())
            editor.moveLeft()
            editor.switchInsertMode()
        } else if (e.key === 'a') {
            editor.insert_after(Editor.place_holder())
            editor.moveRight()
            editor.switchInsertMode()
        } else if (e.key === 'I') {
            // TODO 
        } else if (e.key === 'A') {
            // TODO 
        } else if (e.key === 'o') {
            editor.group()
        } else if (e.key === 'O') {
            editor.ungroup()
        } else if (e.key === 'e') {
            editor.appendChild()
        } else if (e.key === 'p') {
            editor.insert_after(editor.register.clone())
        } else if (e.key === 'P') {
            editor.insert_before(editor.register.clone())
        } else if (e.key === 'y') {
            editor.register = editor.current.clone()
        } else if (e.key === 'u') {
            editor.restore()
        } else if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
            e.preventDefault()
            let content = JSON.stringify(toArrayTree(editor.root))
            save_file('lisp.json', content)
        }
    }
    editor.update_selection(selection_color)
    console.log(editor.selection)
    updateView()

})

let save_file = (filename: string, text: string) => {
    let blob = new Blob([text], { type: 'text/plain' })
    let url = URL.createObjectURL(blob)
    anchor.href = url
    anchor.download = filename
    anchor.click()
    URL.revokeObjectURL(url)
}

compositionCapture(
    (e) => {
        composition_before_text = editor.inputBox.text
    }, (e) => {
        if (isInputBoxVisible(editor.editMode)) {
            editor.inputBox.text = composition_before_text + e.data
            console.log(editor.inputBox.text)
            editor.update_inputbox()
            updateView()
        }
    }
)



