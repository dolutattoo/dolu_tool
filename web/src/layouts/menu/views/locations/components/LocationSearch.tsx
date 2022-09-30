import { TextInput } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { TbSearch } from 'react-icons/tb'
import { useSetRecoilState } from 'recoil'
import { locationActivePageAtom, locationSearchAtom } from '../../../../../atoms/location'
import { useEffect, useState } from 'react'

const LocationSearch: React.FC = () => {
  const [search, setSearch] = useState('')
  const setLocationsSearch = useSetRecoilState(locationSearchAtom)
  const [debouncedSearch] = useDebouncedValue(search, 100)
  const setActivePage = useSetRecoilState(locationActivePageAtom)

  useEffect(() => {
    setLocationsSearch(debouncedSearch)
  }, [debouncedSearch, setLocationsSearch])

  return (
    <>
      <TextInput
        placeholder="Search"
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
