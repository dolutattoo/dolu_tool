import { atom, selector, useRecoilValue } from 'recoil'

export interface WeaponProp {
  hash: number,
  name: string,
}

const mockWeaponList: WeaponProp[] = [
    {
      hash: 2937143193,
      name: "WEAPON_ADVANCEDRIFLE"
    },
    {
      hash: 584646201,
      name: "WEAPON_APPISTOL"
    },
]

export const weaponListAtom = atom<WeaponProp[]>({ key: 'weaponList', default: mockWeaponList })
export const weaponListPageCountAtom = atom<number>({ key: 'weaponListPageCount', default: 1})
// Filter search bar input
export const weaponListSearchAtom = atom<string>({ key: 'weaponListSearch', default: '' })

export const filteredWeaponListAtom = selector({
  key: 'filteredWeaponList',
  get: ({ get }) => {
    const search = get(weaponListSearchAtom)
    const weaponList = get(weaponListAtom)

    if (search === '') return weaponList

    const searchWeaponList = weaponList.filter((weaponList) => {
      const regEx = new RegExp(search, 'gi')
      if (!weaponList.name.match(regEx)) return false

      return true
    })

    return searchWeaponList
  }
})

export const weaponListActivePageAtom = atom<number>({ key: 'weaponListActivePage', default: 1 })

export const useWeaponList = () => useRecoilValue(filteredWeaponListAtom)
export const getSearchWeaponInput = () => useRecoilValue(weaponListSearchAtom) as string
export const getWeaponListPageCount = () => useRecoilValue(weaponListPageCountAtom)