import '../index.css'
import { EditMode, editor, resize, updateView} from './Editor'

let main = () => {
    resize()
    updateView()
}
window.addEventListener('resize', main)

main()