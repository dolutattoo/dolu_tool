import { atom, selector, useRecoilValue } from "recoil"

export interface InteriorData {
    interiorId: number,
    roomCount?: number,
    portalCount?: number,
    rooms?: Array<{
        index: number,
        name: string,
        flag: number,
        timecycle: number,
        isCurrent: boolean
    }>,
    portals?: Array<{
        index: number,
        flag: number,
        roomFrom: number,
        roomTo: number
    }>,
    currentRoom?: {
        index: number,
        name: string,
        flag: number,
        timecycle: number
    }
}

const mockInterior: InteriorData = {
    interiorId: -1,
}

export const interiorAtom = atom<InteriorData>({ key: 'interior', default: mockInterior })
export const portalDebuggingAtom = atom<string[]>({ key: 'portalDebugging', default: [] })
export const portalEditingIndexAtom = atom<number>({ key: 'portalEditingIndex', default: 0 })
export const portalDataAtom = atom<any>({ key: 'portalData', default: null })

export const getInteriorAtom = selector({
    key: 'getInterior',
    get: ({ get }) => {
        return get(interiorAtom)
    },
})

export const getInteriorData = () => useRecoilValue(getInteriorAtom)