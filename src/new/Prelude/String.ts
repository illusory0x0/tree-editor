import * as Array from './Array'

export let replicate = (n: number, s: string): string => Array.replicate(n, s).join('')

export let padding_start = (n: number, s: string, str: string): string => str.padStart(n, s)

export let padding_end = (n: number, s: string, str: string): string => str.padEnd(n, s)

export let slice = (from : number, to: number, str: string): string => str.slice(from, to)