import { atom, useRecoilValue } from 'recoil'

const mockPosition: string = "0, 0, 0"

export const positionAtom = atom<string>({ key: 'position', default: mockPosition })
export const getPosition = () => useRecoilValue(positionAtom)