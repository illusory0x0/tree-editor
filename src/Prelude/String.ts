import * as Array from './Array'

export let replicate = (s:string, n: number): string => Array.replicate(n, s).join('')

export let padding_start = (str: string,s: string,n: number): string => str.padStart(n, s)

export let padding_end = (str: string, s:string, n: number ): string => str.padEnd(n, s)

export let slice = (str: string,from : number, to: number): string => str.slice(from, to)