import { atom, useRecoilState, useRecoilValue } from "recoil"

const mockWorldClock: Date = new Date()
const mockWorldWeather: string = "Neutral"

export const worldClockAtom = atom<Date>({ key: 'worldClock', default: mockWorldClock })
export const worldWeatherAtom = atom<string>({ key: 'worldWeather', default: mockWorldWeather })

export const getWorldClock = () => useRecoilValue(worldClockAtom)
export const getWorldWeather = () => useRecoilValue(worldWeatherAtom)