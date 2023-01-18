import { TextInput } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { TbSearch } from 'react-icons/tb'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { pedListSearchAtom, pedsActivePageAtom } from '../../../../../atoms/ped'
import { useEffect, useState } from 'react'
import { useLocales } from '../../../../../providers/LocaleProvider'
import { fetchNui } from '../../../../../utils/fetchNui'

const PedSearch: React.FC = () => {
  const { locale } = useLocales()
  const [searchPed, setSearchPed] = useState('')
  const setPedSearch = useSetRecoilState(pedListSearchAtom)
  const [debouncedPedSearch] = useDebouncedValue(searchPed, 200)
  const setActivePage = useSetRecoilState(pedsActivePageAtom)

  useEffect(() => {
    setPedSearch(debouncedPedSearch)
    fetchNui('dolu_tool:loadPages', { type: 'peds', activePage: 1, filter: debouncedPedSearch })
  }, [debouncedPedSearch])

  return (
    <>
      <TextInput
        placeholder={locale.ui_search}
        icon={<TbSearch size={20} />}
        value={searchPed}
        onChange={(e) => {
          setActivePage(1)
          setSearchPed(e.target.value)
        }}
      />
    </>
  )
}

export default PedSearch
