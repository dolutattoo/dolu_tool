import { atom, useRecoilValue } from 'recoil'

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
    frozen?: boolean
    invalid?: boolean
}

export const ObjectListAtom = atom<Entity[]|[]>({ key: 'ObjectList', default: [] })
export const ObjectNameAtom = atom<string>({ key: 'ObjectCurrentAccordionItem', default: 'prop_alien_egg_01' })

export const getObjectList = () => useRecoilValue(ObjectListAtom)