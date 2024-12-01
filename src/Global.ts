let query = <T extends Element>(selector: string) =>
    document.querySelector<T>(selector)!
export let canvas = query<HTMLCanvasElement>("#canvas")
export let composition = query<HTMLDivElement>("#composition")
export let anchor = document.createElement('a')
