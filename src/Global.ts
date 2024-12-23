let query = <T extends Element>(selector: string) =>
  document.querySelector<T>(selector)!
export let canvas = query<HTMLCanvasElement>("#canvas")
export let composition = query<HTMLDivElement>("#composition")
export let anchor = document.createElement('a')

export let resize = () => {
    let dpr = window.devicePixelRatio
    dpr = Math.round(dpr) + 1
    // too many decimals, will cause canvas rendering issues
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`
    canvas.getContext("2d")!.scale(dpr, dpr)
}

canvas.addEventListener('focus', () => {
  composition.focus()
})

export let modifier_keys = new Set(['Control', 'Shift', 'Alt'])