import { ActionIcon, Button, Checkbox, Divider, Group, Text, TextInput, Tooltip } from '@mantine/core'
import { useState } from 'react'
import { Check, X } from 'tabler-icons-react'

const Character = () => {

	const [toggleNoClip, setToggleNoClip] = useState<boolean>(false)
	const [toggleGodMod, setToggleGodMod] = useState<boolean>(false)
	const [toggleInvisible, setToggleInvisible] = useState<boolean>(false)
	const [pedModel, setPedModel] = useState<string>('')
	const [weaponModel, setWeaponModel] = useState<string>('')

  return (
    <>
      <Group position='apart'>
        <Text>Toggle NoClip</Text>
        <Checkbox
          checked={toggleNoClip}
          onChange={(event) => {setToggleNoClip(event.currentTarget.checked)}}
        />
      </Group>

      <Divider my="md"/>

      <Group position='apart'>
        <Text>Toggle GodMod</Text>
        <Checkbox
          checked={toggleGodMod}
          onChange={(event) => {setToggleGodMod(event.currentTarget.checked)}}
        />
      </Group>

      <Divider my="md"/>

      <Group position='apart'>
        <Text>Toggle Invisible</Text>
        <Checkbox
          checked={toggleInvisible}
          onChange={(event) => {setToggleInvisible(event.currentTarget.checked)}}
        />
      </Group>

      <Divider my="md"/>

      <Group position='apart'>
        <Text>Change Ped</Text>
        <TextInput  variant="filled" placeholder="Ped Model" value={pedModel} onChange={(event) => setPedModel(event.currentTarget.value)} rightSection={"?"} />
        <ActionIcon>
          <Check/>
        </ActionIcon>
      </Group>

      <Divider my="md"/>

      <Group position='apart'>
        <Text>Give Weapon</Text>
        <TextInput  variant="filled" placeholder="Weapon Model" value={weaponModel} onChange={(event) => setWeaponModel(event.currentTarget.value)} rightSection={"?"} />
        <ActionIcon>
          <Check/>
        </ActionIcon>
        <ActionIcon>
          <X/>
        </ActionIcon>
      </Group>
    </>
  )
}

export default Character