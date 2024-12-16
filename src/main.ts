import '../index.css'
import { EditMode, editor, resize, updateView} from './Editor'





import * as Element from './new/Element/Element'
import { Font ,Color , Vector, Thickness} from './new/Base'
let monospace = Font.make(
    [],
    [Font.GenericFamily.Monospace],
    10,
    Font.Style.Normal,
    1.2
)

import { canvas } from './Global'

let ctx = canvas.getContext('2d')! 
let text = Element.text('Hello World',monospace,Color.hsl(0,0,100))

let padding_text = Element.padding(
    Element.Render(text),
    Thickness.same(2),
    Color.hsl(0,100,50)
)

let border_text = Element.border(
    Element.Render(text),
    Thickness.same(2),
    Color.hsl(120,100,50)
)

let stack = Element.vstack([
  padding_text,
  border_text
],0)

let main = () => {
  resize()
  let rs = Element.getRenderSequence(Vector.make(30,30), stack)
  Element.renderSequence(ctx,rs)

}
// window.addEventListener('resize', main)
main()
