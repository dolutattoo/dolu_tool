import { atom, useRecoilValue } from "recoil"

export interface Entity {
    name: string,
    position: {
        x: number,
        y: number,
        z: number
    },
    rotation: {
        x: number,
        y: number,
        z: number
    },
    frozen?: boolean
}


const mockObjectList: Entity[] = [
    {
        name: 'v_corp_sidechair',
        position: { x: -482, y: -358, z: 34 },
        rotation: { x: 0, y: 0, z: 0 }
    },
    {
        name: 'v_corp_sidechair',
        position: { x: -482, y: -358, z: 34 },
        rotation: { x: 0, y: 0, z: 0 }
    },
    {
        name: 'v_corp_sidechair',
        position: { x: -482, y: -358, z: 34 },
        rotation: { x: 0, y: 0, z: 0 }
    },
    {
        name: 'v_corp_sidechair',
        position: { x: -482, y: -358, z: 34 },
        rotation: { x: 0, y: 0, z: 0 }
    }
]


export const ObjectListAtom = atom<Entity[]>({ key: 'ObjectList', default: mockObjectList })

export const getObjectList = () => useRecoilValue(ObjectListAtom)