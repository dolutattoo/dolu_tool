import { TextInput } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { TbSearch } from 'react-icons/tb'
import { useSetRecoilState } from 'recoil'
import { vehicleListSearchAtom } from '../../../../../atoms/vehicle'
import { useEffect, useState } from 'react'
import { useLocales } from '../../../../../providers/LocaleProvider'

const VehicleSearch: React.FC = () => {
  const { locale } = useLocales()
  const [searchVehicle, setSearchVehicle] = useState('')
  const setVehicleSearch = useSetRecoilState(vehicleListSearchAtom)
  const [debouncedVehicleSearch] = useDebouncedValue(searchVehicle, 200)

  useEffect(() => {
    setVehicleSearch(debouncedVehicleSearch)
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
