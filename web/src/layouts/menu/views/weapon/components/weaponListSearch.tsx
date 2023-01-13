import { TextInput } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { TbSearch } from 'react-icons/tb'
import { useSetRecoilState } from 'recoil'
import { weaponsListSearchAtom } from '../../../../../atoms/weapon'
import { useEffect, useState } from 'react'

const WeaponSearch: React.FC = () => {
  const [searchWeapon, setSearchWeapon] = useState('')
  const setWeaponSearch = useSetRecoilState(weaponsListSearchAtom)
  const [debouncedWeaponSearch] = useDebouncedValue(searchWeapon, 200)

  useEffect(() => {
    setWeaponSearch(debouncedWeaponSearch)
  }, [debouncedWeaponSearch, setWeaponSearch])

  return (
    <>
      <TextInput
        placeholder="Search"
        icon={<TbSearch size={20} />}
        value={searchWeapon}
        onChange={(e) => setSearchWeapon(e.target.value)}
      />
    </>
  )
}

export default WeaponSearch
