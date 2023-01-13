import { atom, useRecoilValue } from 'recoil'

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

export const weaponsListSearchAtom = atom<string>({ key: 'weaponsListSearch', default: '' })
export const weaponsActivePageAtom = atom<number>({ key: 'weaponsActivePage', default: 1 })
export const weaponsPageCountAtom = atom<number>({ key: 'weaponsPageCount', default: 1})
export const weaponsPageContentAtom = atom<WeaponProp[]>({ key: 'weaponsPageContent', default: mockWeaponList })

export const getSearchWeaponInput = () => useRecoilValue(weaponsListSearchAtom) as string
