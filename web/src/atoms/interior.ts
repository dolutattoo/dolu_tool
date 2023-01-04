import { atom, selector, useRecoilValue } from "recoil"

export interface InteriorData {
    interiorId: number
    roomCount?: number
    portalCount?: number
    rooms?: Array<{
        index: number
        name: string
        timecycle: number
        isCurrent: boolean
        flags: {
            list: string[]
            total: number
        }
    }>
    portals?: Array<{
        index: number
        roomFrom: number
        roomTo: number
        flags: {
            list: string[]
            total: number
        }
    }>
    currentRoom?: {
        index: number
        name: string
        timecycle: number
        flags: {
            list: string[]
            total: number
        }
    }
}

const mockInterior: InteriorData = {
    interiorId: -1
}

export const interiorAtom = atom<InteriorData>({ key: 'interior', default: mockInterior })
export const portalDebuggingAtom = atom<string[]>({ key: 'portalDebugging', default: [] })
export const portalEditingIndexAtom = atom<number>({ key: 'portalEditingIndex', default: 0 })
export const portalDataAtom = atom<any>({ key: 'portalData', default: null })
export const portalFlagsAtom = atom<string[]>({ key: 'portalFlags', default: [] })

export const getInteriorAtom = selector({
    key: 'getInterior',
    get: ({ get }) => {
        return get(interiorAtom)
    },
})

export const getPortalFlagListAtom = selector({
    key: 'getPortalFlagList',
    get: ({ get }) => {
        const interior = get(interiorAtom)
        const index = get(portalEditingIndexAtom) 
        
        if (!interior.portals) return []
        
        return interior.portals[index].flags.list
    },
})

export const getInteriorData = () => useRecoilValue(getInteriorAtom)
export const getPortalFlagsList = () => useRecoilValue(getPortalFlagListAtom)