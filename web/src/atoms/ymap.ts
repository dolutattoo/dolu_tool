import { atom } from "recoil"
import { Entity } from "./object"

export interface Ymap {
    name: string
    entities?: Entity[]
}

export const YmapListAtom = atom<Ymap[]|null>({ key: 'YmapList', default: null })