import { atom } from 'recoil'

export const versionAtom = atom<{ version: string, outdated?: string }>({ key: 'version', default: {version: ""} })