import { ColorText, Doc, Tree } from "./format"
import { sort, group } from "./func"
import { Grid } from "./ui_base"

export type Node = Tree<string>
export type SelectionRegion = [Grid, Grid]
export type isomorphism_Node_SelectionRegion = Map<Node, SelectionRegion>
export type isomorphism_Cursor_LeafNode = Node[][]

export let generate_isomorphism_Cursor_Node = (m: isomorphism_Node_SelectionRegion): isomorphism_Cursor_LeafNode => {
    let w: [Node, Grid][] = []
    for (let [key, [start, _]] of m.entries()) {
        if (key.subForest.length === 0) {
            w.push([key, start])
        }
    }
    w = sort(w, ([et1, es1], [et2, es2]) => {
        return es1.row < es2.row
    })
    let w2 = group(w,
        (_, [et, es]) => es,
        (s, [et, es]) => s.row !== es.row,
        new Grid(0, 0)
    ).map(x => sort(x, ([et1, es1], [et2, es2]) => es2.col < es2.col))
    let w3 = w2.map(x => x.map(y => y[0]))
    return w3
}
export let generate_isomorphism_Node_SelectionRegion = (block: Doc): isomorphism_Node_SelectionRegion => {
    let start = new Map<Node, Grid>()
    let end = new Map<Node, Grid>()
    for (let row = 0; row < block.length; row++) {
        let col = 1
        for (let span of block[row].texts) {
            if (span instanceof ColorText) {
                ++col
            } else {
                if (!start.has(span)) {
                    start.set(span, new Grid(row, col))
                } else {
                    end.set(span, new Grid(row, col))
                }
            }
        }
    }
    let result = new Map<Node, SelectionRegion>()
    for (let [key, value] of start.entries()) {
        result.set(key, [value, end.get(key)!])
    }
    return result
}


export let from_LeafNode_to_Cursor = (matrix: Node[][], pos: Node): Grid | null => {
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] === pos) {
                return new Grid(row, col)
            }
        }
    }
    return null
}

export let form_Cursor_to_LeafNode = (matrix: Node[][], pos: Grid): Node | null => {
    if (pos.row < matrix.length && pos.col < matrix[pos.row].length) {
        return matrix[pos.row][pos.col]
    }
    return null
}