import { atom } from 'recoil'

export interface StanceSettings {
    vehicleName: string
    wheelCount: number
    suspensionHeight: number
    wheelOffsetFront: number
    wheelOffsetRear: number
    wheelCamberFront: number
    wheelCamberRear: number
}

export const suspensionHeightAtom = atom<number>({ key: 'suspensionHeight', default: 0 })
export const wheelCountAtom = atom<number>({ key: 'wheelCount', default: 0 })
export const wheelOffsetFrontAtom = atom<number>({ key: 'wheelOffsetFront', default: 0 })
export const wheelOffsetRearAtom = atom<number>({ key: 'wheelOffsetRear', default: 0 })
export const wheelCamberFrontAtom = atom<number>({ key: 'wheelCamberFront', default: 0 })
export const wheelCamberRearAtom = atom<number>({ key: 'wheelCamberRear', default: 0 })