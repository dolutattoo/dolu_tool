import { atom, selector, useRecoilValue } from 'recoil'
import { fetchNui } from '../utils/fetchNui'

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

export const pedListAtom = atom<PedProp[]>({ key: 'pedList', default: mockPedList })

export const pedListSearchAtom = atom<string>({
  key: 'pedListSearch',
  default: '',
})

export const filteredPedListAtom = selector({
  key: 'filteredPedList',
  get: ({ get }) => {
    const search = get(pedListSearchAtom)
    const pedList = get(pedListAtom)

    if (search === '') return pedList

    const searchPedList = pedList.filter((pedList) => {
      const regEx = new RegExp(search, 'gi')
      if (!pedList.name.match(regEx)) return false

      return true
    })

    return searchPedList
  }
})

export const changePed = (value: PedProp) => {
  fetchNui('dmt:changePed', value)
}

export const usePedList = () => useRecoilValue(filteredPedListAtom)
export const getSearchPedInput = () => useRecoilValue(pedListSearchAtom)