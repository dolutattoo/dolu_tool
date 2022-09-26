import { atom, selector, useRecoilValue } from 'recoil'
import { fetchNui } from '../utils/fetchNui'

export interface LocationProp {
  name: string,
  x: number,
  y: number,
  z: number,
  heading?: number,
  metadata?: any,
  isLastLocationUsed?: boolean
}

export interface Location {
  custom: Array<LocationProp>
  vanilla: Array<LocationProp>
}

const mockLocations: Location = {
  custom: [
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
  ],
  vanilla: [
    {
      name: "Vanilla Location test 1",
      x: 12,
      y: 11,
      z: 10,
    }
  ]
}

export const locationsAtom = atom<Location>({ key: 'locations', default: mockLocations })

export const locationSearchAtom = atom<string>({
  key: 'locationSearch',
  default: '',
})

export const locationVanillaFilterAtom = atom<boolean>({
  key: 'locationVanillaFilter',
  default: false,
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

    const isCustomChecked = get(locationCustomFilterAtom)
    const isVanillaChecked = get(locationVanillaFilterAtom)

    var finalLocation: LocationProp[] = locations.custom
    
    if (isCustomChecked && !isVanillaChecked) {
      finalLocation = locations.custom
    
    } else if (!isCustomChecked && isVanillaChecked) {
      finalLocation = locations.vanilla
    
    } else if (isCustomChecked && isVanillaChecked) {
      const allLocations = locations.vanilla.concat(locations.custom)
      finalLocation = allLocations
    }

    if (search === '') return finalLocation

    const searchedLocations = finalLocation?.filter((location) => {
      const regEx = new RegExp(search, 'gi')
      if (!location.name.match(regEx)) return false

      return true
    })

    return searchedLocations
  },
})

export const selectedLocationIdAtom = atom<string | null>({ key: 'selectedLocationIndex', default: null })

export const lastLocationUsedAtom = selector({
  key: 'lastLocationUsed',
  get: ({ get }) => {
    const location = get(locationsAtom).custom.find((location) => location.isLastLocationUsed)
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

export const teleportToLocation = (value: LocationProp) => {
  fetchNui('teleportToLocation', value)
}

export const useLocation = () => useRecoilValue(filteredLocationsAtom)
export const getLastLocationUsed = () => useRecoilValue(lastLocationUsedAtom)
