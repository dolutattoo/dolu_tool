import { atom, useRecoilValue } from 'recoil'

export interface PedProp {
  name: string,
  hash?: number
}

const mockPedList: PedProp[] = [
    {
      name: "A_F_M_BodyBuild_01",
      hash: -1051758075
    },
    {
      name: "A_F_M_Business_02",
      hash: 955823835
    },
]

export const pedListSearchAtom = atom<string>({ key: 'pedListSearch', default: '' })
export const pedsActivePageAtom = atom<number>({ key: 'pedsActivePage', default: 1 })
export const pedsPageCountAtom = atom<number>({ key: 'pedsPageCount', default: 1 })
export const pedsPageContentAtom = atom<PedProp[]>({ key: 'pedsPageContent', default: mockPedList })

export const getSearchPedInput = () => useRecoilValue(pedListSearchAtom) as string