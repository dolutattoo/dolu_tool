import { Button, Divider, Group, NumberInput, Stack, Text, TextInput } from "@mantine/core"
import { closeAllModals } from "@mantine/modals"
import { useState } from "react"
import { fetchNui } from "../../../../../utils/fetchNui"

const SetCoords: React.FC = () => {
    const [coordString, setCoordString] = useState('0.0, 0.0, 0.0')
    const [coordX, setCoordX] = useState(0)
    const [coordY, setCoordY] = useState(0)
    const [coordZ, setCoordZ] = useState(0)
    
    return (
        <Stack>
            <Text weight={500}>Set as string</Text>
            <TextInput value={coordString} onChange={(e) => setCoordString(e.target.value)} />
            <Button
                uppercase
                disabled={coordString === ''}
                variant="outline"
                color="blue.4"
                onClick={() => {
                    closeAllModals()
                    fetchNui('dolu_tool:setCustomCoords', { coordString: coordString })
                }}
            > Confirm</Button>
            
            <Divider my="sm" />
            <Text weight={500}>Set as separated values</Text>
            
            <Group grow sx={{ maxWidth:300 }}>
                <NumberInput noClampOnBlur defaultValue={0.0} label="X" value={coordX} onChange={(value) => value && setCoordX(value)} step={0.5} stepHoldDelay={500} stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)} />
                <NumberInput noClampOnBlur defaultValue={0.0} label="Y" value={coordY} onChange={(value) => value && setCoordY(value)} step={0.5} stepHoldDelay={500} stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)} />
                <NumberInput noClampOnBlur defaultValue={0.0} label="Z" value={coordZ} onChange={(value) => value && setCoordZ(value)} step={0.5} stepHoldDelay={500} stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)} />
            </Group>

            <Button
                uppercase
                disabled={coordString === ''}
                variant="outline"
                color="blue.4"
                onClick={() => {
                    closeAllModals()
                    fetchNui('dolu_tool:setCustomCoords', { coords: { x: coordX, y: coordY, z: coordZ } })
                }}
            >Confirm</Button>
        </Stack>
        )
    }
    
    export default SetCoords