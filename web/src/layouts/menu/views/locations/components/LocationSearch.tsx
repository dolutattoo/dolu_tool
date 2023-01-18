import { TextInput } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { TbSearch } from 'react-icons/tb'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { locationCustomFilterAtom, locationsActivePageAtom, locationSearchAtom, locationVanillaFilterAtom } from '../../../../../atoms/location'
import { useEffect, useState } from 'react'
import { useLocales } from '../../../../../providers/LocaleProvider'
import { fetchNui } from '../../../../../utils/fetchNui'

const LocationSearch: React.FC = () => {
  const { locale } = useLocales()
  const [search, setSearch] = useState('')
  const setLocationsSearch = useSetRecoilState(locationSearchAtom)
  const [debouncedSearch] = useDebouncedValue(search, 100)
  const setActivePage = useSetRecoilState(locationsActivePageAtom)
  const checkedVanilla = useRecoilValue(locationVanillaFilterAtom)
  const checkedCustom = useRecoilValue(locationCustomFilterAtom)

  useEffect(() => {
    setLocationsSearch(debouncedSearch)
    fetchNui('dolu_tool:loadPages', { type: 'locations', activePage: 1, filter: debouncedSearch, checkboxes: { vanilla: checkedVanilla, custom: checkedCustom } })
  }, [debouncedSearch])

  return (
    <>
      <TextInput
        placeholder={locale.ui_search}
        icon={<TbSearch size={20} />}
        value={search}
        onChange={(e) => {
          setActivePage(1)
          setSearch(e.target.value)
        }}
      />
    </>
  )
}

export default LocationSearch
