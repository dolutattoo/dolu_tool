import { atom } from 'recoil'

export const displayImageAtom = atom<boolean>({ key: 'displayImage', default: false })
export const imagePathAtom = atom<string>({ key: 'imagePath', default: '' })
const resourceName = (window as any).GetParentResourceName ? (window as any).GetParentResourceName() : 'nui-frame-app'
export const resourceNameAtom = atom<string>({ key: 'resourceName', default: resourceName })