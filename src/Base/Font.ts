import {  array, Array } from '../Prelude'

export enum Style {
  Normal = 'normal',
  Italic = 'italic'
}
export enum GenericFamily {
  Serif = 'serif',
  SansSerif = 'sans-serif',
  Monospace = 'monospace',
  Cursive = 'cursive',
  Fantasy = 'fantasy',
  SystemUI = 'system-ui',
  UISerif = 'ui-serif',
  UISansSerif = 'ui-sans-serif',
  UIMonospace = 'ui-monospace',
  UIRounded = 'ui-rounded',
  Math = 'math',
  Emoji = 'emoji',
  FangSong = 'FangSong'
}
export type t = {
  readonly family: array<string>,
  readonly genericFamily: array<GenericFamily>,
  readonly size: int,
  readonly style: Style,
  readonly weight: float
}
export let make = (family: array<string>, genericFamily: array<GenericFamily>, size: int, style: Style, weight: float): t => ({
  family,
  genericFamily,
  size,
  style,
  weight
})

export let toCSS = ({ family, genericFamily, size, style, weight }: t) => {
  let quote = (s: string) => `'${s}'`
  let f = Array.append(Array.map(family, quote), genericFamily)
  //  String values must be quoted but may contain any Unicode character.
  // https://developer.mozilla.org/en-US/docs/Web/CSS/font-family#values

  return `${style} ${weight} ${size}px ${f}`
  // Generic family names are keywords and must not be quoted. 
  // https://developer.mozilla.org/en-US/docs/Web/CSS/font-family#generic-name
}

export let renderingContext2D = document.createElement('canvas').getContext('2d')!

export let measureText = (text: string, font: t) => {
  let ctx = renderingContext2D
  ctx.font = toCSS(font)
  return ctx.measureText(text)
}