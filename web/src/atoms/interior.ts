import { atom, selector, useRecoilValue } from "recoil"

export interface InteriorData {
    interiorId: number,
    roomCount?: number,
    portalCount?: number,
    rooms?: Array<{
        roomId: number,
        name: string,
        flag: number,
        timecycle: number,
        isCurrent: boolean
    }>,
    portals?: Array<{
        flag: number,
        roomFrom: number,
        roomTo: number
    }>,
    currentRoom?: {
        id: number,
        name: string,
        flag: number,
        timecycle: number
    }
}

const mockInterior: InteriorData = {
    interiorId: -1,
}

export const interiorAtom = atom<InteriorData>({ key: 'interior', default: mockInterior })

export const getInteriorAtom = selector({
    key: 'getInterior',
    get: ({ get }) => {
        return get(interiorAtom)
    },
})


export const getInteriorData = () => useRecoilValue(getInteriorAtom)