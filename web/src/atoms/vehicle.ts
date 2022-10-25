import { atom, selector, useRecoilValue } from 'recoil'
import { fetchNui } from '../utils/fetchNui'

export interface VehicleProp {
  hash: number,
  name: string,
  class: string,
  displayName: string,
  type: string,
  dlc: string,
  manufacturer: string,
}

const mockVehicleList: VehicleProp[] = [
    {
      hash: -1216765807,
      name: "adder",
      class: "SUPER",
      displayName: "Adder",
      type: "CAR",
      dlc: "TitleUpdate",
      manufacturer: "Truffade"
    },
    {
      hash: -214906006,
      name: "jester3",
      class: "SPORT",
      displayName: "Jester Classic",
      type: "CAR",
      dlc: "mpassault",
      manufacturer: "Dinka"
    },
]

export const vehicleListAtom = atom<VehicleProp[]>({ key: 'vehicleList', default: mockVehicleList })
export const vehicleListPageCountAtom = atom<number>({ key: 'vehicleListPageCount', default: 1})
// Filter search bar input
export const vehicleListSearchAtom = atom<string>({ key: 'vehicleListSearch', default: '' })

export const filteredVehicleListAtom = selector({
  key: 'filteredVehicleList',
  get: ({ get }) => {
    const search = get(vehicleListSearchAtom)
    const vehicleList = get(vehicleListAtom)

    if (search === '') return vehicleList

    const searchVehicleList = vehicleList.filter((vehicleList) => {
      const regEx = new RegExp(search, 'gi')
      if (!vehicleList.name.match(regEx)) return false

      return true
    })

    return searchVehicleList
  }
})

export const changeVehicle = (value: VehicleProp) => {
  fetchNui('dmt:changeVehicle', value)
}


export const vehicleListActivePageAtom = atom<number>({ key: 'vehicleListActivePage', default: 1 })

export const useVehicleList = () => useRecoilValue(filteredVehicleListAtom)
export const getSearchVehicleInput = () => useRecoilValue(vehicleListSearchAtom) as string
export const getVehicleListPageCount = () => useRecoilValue(vehicleListPageCountAtom)