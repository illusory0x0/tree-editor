import { array ,Array } from "../Prelude"

import * as Text from './Text'

export type t = {
  indentation: int,
  texts: array<Text.t>
}

export let make = (indentation: int, texts: array<Text.t>): t => ({ indentation, texts })

export let  width = (line: t): int => {
  return Array.foldl(line.texts, line.indentation, (acc, text) => acc + Text.length(text))
}

export let  cons = (text: Text.t, line: t): t => {
  return { indentation: line.indentation, texts: [text, ...line.texts] }
}

export let  snoc = (line: t, text: Text.t): t => {
  return { indentation: line.indentation, texts: [...line.texts, text] }
}

export let  append = (line1: t, line2: t): t => {
  return { indentation: line1.indentation, texts: [...line1.texts, ...line2.texts] }
}

export let  indent = (n: int, line: t): t => {
  return { indentation: line.indentation + n, texts: line.texts }
}

