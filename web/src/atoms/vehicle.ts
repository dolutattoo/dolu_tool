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
export const vehiclesTabAtom = atom<string|null>({ key: 'vehiclesTab', default: 'custom' })
export const vehicleModsAtom = atom({ key: 'vehicleMods', default: [
  {
    name: 'Engine',
    level: 4,
    current: 2,
    imgName: 'https://img.icons8.com/external-goofy-color-kerismaker/512/external-Engine-car-auto-parts-goofy-color-kerismaker.png'
  },
  {
    name: 'Brakes',
    level: 4,
    current: 3,
    imgName: 'https://img.icons8.com/external-goofy-color-kerismaker/512/external-Disc-Break-car-auto-parts-goofy-color-kerismaker.png'
  },
  {
    name: 'Transmission',
    level: 4,
    current: 2,
    imgName: 'https://img.icons8.com/external-goofy-color-kerismaker/512/external-Gear-Stick-Manual-car-auto-parts-goofy-color-kerismaker.png'
  },
  {
    name: 'Suspension',
    level: 4,
    current: 0,
    imgName: 'https://img.icons8.com/external-goofy-color-kerismaker/512/external-Sock-Absorber-car-auto-parts-goofy-color-kerismaker.png'
  },
  {
    name: 'Armor',
    level: 4,
    current: 3,
    imgName: 'https://img.icons8.com/external-goofy-color-kerismaker/512/external-Rear-Front-Door-car-auto-parts-goofy-color-kerismaker.png'
  },
  {
    name: 'Turbo',
    level: 4,
    current: 4,
    imgName: 'https://img.icons8.com/external-goofy-color-kerismaker/512/external-Turbo-car-auto-parts-goofy-color-kerismaker.png'
  },
  {
    name: 'Tires',
    level: 4,
    current: 2,
    imgName: 'https://img.icons8.com/external-goofy-color-kerismaker/512/external-Pressure-car-auto-parts-goofy-color-kerismaker.png'
  },
  {
    name: 'Horn',
    level: 4,
    current: 4,
    imgName: 'https://img.icons8.com/external-goofy-color-kerismaker/512/external-Horn-car-auto-parts-goofy-color-kerismaker.png'
  },
  {
    name: 'Lights',
    level: 4,
    current: 1,
    imgName: 'https://img.icons8.com/external-goofy-color-kerismaker/512/external-Headlamp-car-auto-parts-goofy-color-kerismaker.png'
  }
]})

export const getSearchVehicleInput = () => useRecoilValue(vehicleListSearchAtom) as string
