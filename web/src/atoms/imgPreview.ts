import { atom } from 'recoil'

export const displayImageAtom = atom<boolean>({ key: 'displayImage', default: false })
export const imagePathAtom = atom<string>({ key: 'imagePath', default: '' })