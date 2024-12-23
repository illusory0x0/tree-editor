import '../index.css'
import { Vector } from './Base'
import * as Church from './Expr/Church'
import * as Expr from './Expr/Expr'
import * as Value from './Expr/Value'
import * as Renderable from './Element/Renderable'
import * as TextCursor from './Expr/TextCursor'
import * as Global from './Global'
import * as Editor from './Editor/Editor'
import { update_txtcsr, update_expcsr, sync_txtsel } from './Editor/Editor'

let lhs = Church.from(3)
let rhs = Church.from(4)
let v = Expr.App(Expr.App(Expr.Var("add"), lhs), rhs)


let model = Editor.makeModel(Value.runProgram(Church.defs, v))
let view = Editor.makeView(model)


let renderApp = () => {
  let rs = Editor.toRenderSequence(view, Vector.make(20, 20))
  let ctx = Global.canvas.getContext('2d')!
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

window.addEventListener('resize', () => { main() })
