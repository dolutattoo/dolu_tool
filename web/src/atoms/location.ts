import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil'
import { fetchNui } from '../utils/fetchNui'

export interface Location {
  name: string,
  x: number,
  y: number,
  z: number,
  heading?: number,
  custom?: boolean
  metadata?: any,
  isLastLocationUsed?: boolean
}

const mockLocations: Location[] = [
    {
      name: "Custom Location test 1",
      x: 12,
      y: 11,
      z: 10
    },
    {
      name: "Custom Location test 2",
      x: 12,
      y: 11,
      z: 10,
      heading: 150,
      isLastLocationUsed: true
    }
]

export const locationsAtom = atom<Location[]>({ key: 'locations', default: mockLocations })
export const lastLocationsAtom = atom<Location|null>({ key: 'lastLocations', default: null })
export const locationsPageCountAtom = atom<number>({ key: 'locationsPageCount', default: 1 })

// Filter search bar input
export const locationSearchAtom = atom<string>({ key: 'locationSearch', default: '' })

// Filter Checkboxes
export const locationVanillaFilterAtom = atom<boolean>({ key: 'locationVanillaFilter', default: true })
export const locationCustomFilterAtom = atom<boolean>({ key: 'locationCustomFilter', default: true })

export const filteredLocationsAtom = selector({
  key: 'filteredLocations',
  get: ({ get }) => {
    const search = get(locationSearchAtom)
    const locations = get(locationsAtom)
    const isCustomChecked = get(locationCustomFilterAtom)
    const isVanillaChecked = get(locationVanillaFilterAtom)

    const searchedLocations = locations.filter((location) => {
      if (search !== '') {
        const regEx = new RegExp(search, 'gi')
        if (!location.name.match(regEx)) return false      
      }
      if (isCustomChecked && location.custom) return true
      if (isVanillaChecked && !location.custom) return true

      return false
    })

    return searchedLocations
  }
})

export const locationActivePageAtom = atom<number>({ key: 'locationActivePage', default: 1 })

export const selectedLocationIdAtom = atom<string | null>({ key: 'selectedLocationIndex', default: null })

export const useLocation = () => useRecoilValue(filteredLocationsAtom)
export const getLastLocation = () => useRecoilValue(lastLocationsAtom)
export const getLocationPageCount = () => useRecoilValue(locationsPageCountAtom)
