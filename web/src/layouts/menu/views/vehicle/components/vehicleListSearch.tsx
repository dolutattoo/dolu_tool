import { useEffect, useState } from 'react'
import { TextInput } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { TbSearch } from 'react-icons/tb'
import { vehicleListSearchAtom, vehiclesActivePageAtom } from '../../../../../atoms/vehicle'
import { fetchNui } from '../../../../../utils/fetchNui'
import { useLocales } from '../../../../../providers/LocaleProvider'

const VehicleSearch: React.FC = () => {
  const { locale } = useLocales()
  const [searchVehicle, setSearchVehicle] = useState('')
  const setVehicleSearch = useSetRecoilState(vehicleListSearchAtom)
  const [debouncedVehicleSearch] = useDebouncedValue(searchVehicle, 200)
  const activePage = useRecoilValue(vehiclesActivePageAtom)

  useEffect(() => {
    setVehicleSearch(debouncedVehicleSearch)
    fetchNui('dolu_tool:loadPages', { type: 'vehicles', activePage: activePage, filter: debouncedVehicleSearch })
  }, [debouncedVehicleSearch, setVehicleSearch])

  return (
    <>
      <TextInput
        placeholder={locale.ui_search}
        icon={<TbSearch size={20} />}
        value={searchVehicle}
        onChange={(e) => setSearchVehicle(e.target.value)}
      />
    </>
  )
}

export default VehicleSearch
