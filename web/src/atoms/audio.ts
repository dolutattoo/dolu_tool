import { SelectItem } from "@mantine/core"
import { atom } from "recoil"

export interface StaticEmitter {
    name: string
    coords: string
    distance: number
    flags: string
    interior: string
    room: string
    radiostation: string
}

const mockStaticEmitters: StaticEmitter = {
    name: "collision_75oaiz",
    distance: 10,
    coords: "0.0, 12.2, 0.0",
    flags: "0xAA040011",
    interior: "none",
    room: "none",
    radiostation: "HIDDEN_RADIO_07_DANCE_01"
}

export const staticEmittersListAtom = atom<StaticEmitter>({ key: 'staticEmittersList', default: mockStaticEmitters })
export const drawStaticEmittersAtom = atom<boolean>({ key: 'drawStaticEmittersAtom', default: false })
export const staticEmittersDrawDistanceAtom = atom<number>({ key: 'staticEmittersDrawDistance', default: 20 })
export const radioStationsListAtom = atom<Array<{ label: string, value: string }>>({ key: 'radioStationsList', default: [{label: "Unknown", value: "0" }]})