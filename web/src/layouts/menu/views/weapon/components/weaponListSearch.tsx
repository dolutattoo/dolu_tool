import { TextInput } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { TbSearch } from 'react-icons/tb'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { weaponsActivePageAtom, weaponsListSearchAtom } from '../../../../../atoms/weapon'
import { useEffect, useState } from 'react'
import { useLocales } from '../../../../../providers/LocaleProvider'
import { useNuiEvent } from '../../../../../hooks/useNuiEvent'
import { fetchNui } from '../../../../../utils/fetchNui'

const WeaponSearch: React.FC = () => {
  const { locale } = useLocales()
  const [searchWeapon, setSearchWeapon] = useState('')
  const setWeaponSearch = useSetRecoilState(weaponsListSearchAtom)
  const [debouncedWeaponSearch] = useDebouncedValue(searchWeapon, 200)
  const activePage = useRecoilValue(weaponsActivePageAtom)

  useEffect(() => {
    setWeaponSearch(debouncedWeaponSearch)
    fetchNui('dolu_tool:loadPages', { type: 'weapons', activePage: activePage, filter: debouncedWeaponSearch })
  }, [debouncedWeaponSearch, setWeaponSearch])

  return (
    <>
      <TextInput
        placeholder={locale.ui_search}
        icon={<TbSearch size={20} />}
        value={searchWeapon}
        onChange={(e) => setSearchWeapon(e.target.value)}
      />
    </>
  )
}

export default WeaponSearch
