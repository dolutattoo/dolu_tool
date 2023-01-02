import { atom, useRecoilValue } from "recoil"

export interface Entity {
    handle: number
    name: string
    position: {
        x: number
        y: number
        z: number
    },
    rotation: {
        x: number
        y: number
        z: number
    },
    ymap?: string
    frozen?: boolean
}

export const ObjectListAtom = atom<Entity[]|[]>({ key: 'ObjectList', default: [] })

export const getObjectList = () => useRecoilValue(ObjectListAtom)