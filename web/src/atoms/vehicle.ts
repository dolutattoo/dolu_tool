import { atom, useRecoilValue } from 'recoil'

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

export const vehicleListSearchAtom = atom<string>({ key: 'vehicleListSearch', default: '' })
export const vehiclesActivePageAtom = atom<number>({ key: 'vehicleActivePage', default: 1 })
export const vehiclesPageCountAtom = atom<number>({ key: 'vehiclePageCount', default: 1})
export const vehiclesPageContentAtom = atom<VehicleProp[]>({ key: 'vehiclesPageContent', default: mockVehicleList })
export const vehiclesTabAtom = atom<string|null>({ key: 'vehiclesTab', default: 'search' })

export const getSearchVehicleInput = () => useRecoilValue(vehicleListSearchAtom) as string
