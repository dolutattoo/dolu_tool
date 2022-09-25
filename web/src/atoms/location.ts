import { atom, selector, useRecoilValue } from 'recoil'
import { fetchNui } from '../utils/fetchNui'

export interface Location {
  name: string,
  x: number,
  y: number,
  z: number,
  heading?: number,
  metadata?: any,
  isLastLocationUsed?: boolean
}

const mockLocations: Location[] = [
  {
    name: "Location test 1",
    x: 12,
    y: 11,
    z: 10
  },
  {
    name: "Location test 2",
    x: 12,
    y: 11,
    z: 10,
    heading: 150
  },
  {
    name: "Location test 1",
    x: 12,
    y: 11,
    z: 10,
    isLastLocationUsed: true
  },
]

export const locationsAtom = atom<Location[]>({ key: 'locations', default: mockLocations })

export const locationSearchAtom = atom<string>({
  key: 'locationSearch',
  default: '',
})

export const locationVanillaFilterAtom = atom<boolean>({
  key: 'locationVanillaFilter',
  default: true,
})

export const locationCustomFilterAtom = atom<boolean>({
  key: 'locationCustomFilter',
  default: true,
})

export const filteredLocationsAtom = selector({
  key: 'filteredLocations',
  get: ({ get }) => {
    const search = get(locationSearchAtom)
    const locations = get(locationsAtom)
    if (search === '') return locations

    const searchedLocations = locations.filter((location) => {
      const regEx = new RegExp(search, 'gi')
      if (!location.name.match(regEx)) return false

      return true
    })

    return searchedLocations
  },
})

export const selectedLocationIdAtom = atom<string | null>({ key: 'selectedLocationIndex', default: null })

export const selectedLocationAtom = selector({
  key: 'selectedLocation',
  get: ({ get }) => {
    const name = get(selectedLocationIdAtom)
    const locations = get(locationsAtom)
    return locations.find((location) => location.name === name) || null
  },
})

export const defaultLocationAtom = selector({
  key: 'defaultAccount',
  get: ({ get }) => {
    const location = get(locationsAtom).find((location) => location.isLastLocationUsed)
    if (location) return location
    // debug data for web
    return {
      name: "Location test X",
      x: 12,
      y: 11,
      z: 10,
      isLastLocationUsed: true
    } as Location
  },
})

export const lastLocationUsedAtom = selector({
  key: 'lastLocationUsed',
  get: ({ get }) => {
    const location = get(locationsAtom).find((location) => location.isLastLocationUsed)
    if (location?.isLastLocationUsed === true) return location

    return {
      name: "You did not used any location yet",
      x: 0,
      y: 0,
      z: 0,
      isLastLocationUsed: true
    }
  }
})

// export const teleportToLocation = (value: { x: number, y: number, z: number, heading?: number }) => {
export const teleportToLocation = (value: any) => {
  fetchNui('teleportToLocation', value)
}

export const useDefaultLocation = () => useRecoilValue(defaultLocationAtom)
export const useLocation = () => useRecoilValue(filteredLocationsAtom)
export const useSelectedLocation = () => useRecoilValue(selectedLocationAtom)
export const getLastLocationUsed = () => useRecoilValue(lastLocationUsedAtom)
