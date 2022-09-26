import { atom, selector, useRecoilValue } from "recoil";

export interface InteriorData {
    interiorId: number,
    roomCount?: number,
    portalCount?: number,
    rooms?: any,
    portals?: any,
    currentRoomIndex?: number
}

const mockInterior: InteriorData = {
    interiorId: 123,
    roomCount: 5,
    portalCount: 5,
    rooms: {},
    portals: {},
    currentRoomIndex: 2
}
// const mockInterior: InteriorData = {
//     interiorId: -1,
// }

export const interiorAtom = atom<InteriorData>({ key: 'interior', default: mockInterior })

export const getInteriorAtom = selector({
    key: 'getInterior',
    get: ({ get }) => {
        return get(interiorAtom)
    },
})


export const getInteriorData = () => useRecoilValue(getInteriorAtom)