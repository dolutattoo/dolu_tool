import { atom } from 'recoil'

export interface Version {
    currentVersion: string
    url?: string
}

export const versionAtom = atom<Version>({ key: 'version', default: { currentVersion: "" } })