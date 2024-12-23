export type t<a> = a | undefined  

export let Just = <a>(a: a): t<a> => a
export const Nothing =  undefined

export let fromJust = <a>(ma: t<a>): a => {
  if (ma === undefined) {
    throw new Error("fromJust: Nothing")
  }
  return ma
}

export let isJust = <a>(ma: t<a>): ma is a => ma !== undefined
export let isNothing = <a>(ma: t<a>): ma is undefined => ma === undefined