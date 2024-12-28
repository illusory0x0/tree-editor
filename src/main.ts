import '../index.css'
import { Vector } from './Base'
import { Church, Doc, Expr, Line, Text, TextCursor, TextSelection, Value } from './Expr'
import { Renderable } from './Element'

import * as Global from './Global'
import * as Editor from './Editor'
import { update_txtcsr, update_expcsr } from './Editor/Model'
import { sync_txtsel } from './Editor/View'


let lhs = Church.from(3)
let rhs = Church.from(4)
let v = Expr.App(Expr.App(Expr.Var("add"), lhs), rhs)


let model = Editor.Model.make(Value.runProgram(Church.defs, v))
let view = Editor.View.make(model)


let renderApp = () => {
  let rs = Editor.View.toRenderSequence(view, Vector.make(20, 20))
  let ctx = Global.canvas.getContext('2d')!
  ctx.clearRect(0,0,window.innerWidth,window.innerHeight)
  Renderable.renderSequence(ctx, rs)
}
window.addEventListener('keydown', (e) => {
  let key = e.key
  if (key === "h") {
    update_txtcsr(model, TextCursor.moveLeft(model.txtcsr, model.csrbij))
    sync_txtsel(view, model.txtsel)
  } else if (key === "j") {
    update_txtcsr(model, TextCursor.moveDown(model.txtcsr, model.csrbij))
    sync_txtsel(view, model.txtsel)
  } else if (key === "k") {
    update_txtcsr(model, TextCursor.moveUp(model.txtcsr, model.csrbij))
    sync_txtsel(view, model.txtsel)
  } else if (key === "l") {
    update_txtcsr(model, TextCursor.moveRight(model.txtcsr, model.csrbij))
    sync_txtsel(view, model.txtsel)
  } else if (key === "L") {
    update_expcsr(model, Expr.parent(model.expcsr, model.exp) ?? model.expcsr)
    sync_txtsel(view, model.txtsel)
  }
  renderApp()
})

let main = () => {
  Global.resize()
  renderApp()
}

main()

window.addEventListener('resize', main)