import React from "react"
import { Box, Button, Tooltip, createStyles } from "@mantine/core"
import { BiWorld } from "react-icons/bi"
import { LuRotate3D, LuMove } from "react-icons/lu"
import { TbGizmo } from "react-icons/tb"
import { KeyboardLayoutAtom } from "../../atoms/object"
import { useRecoilState } from "recoil"
import { FaKeyboard } from "react-icons/fa"

const useStyles = createStyles((theme) => ({
  selector: {
    display: 'flex',
    position: 'absolute',
    color: theme.colors.dark[1],
    justifyContent: 'center',
    alignItems: 'center',
    bottom: '2rem',
    gap: '0.7rem',
    zIndex: 2,
  },
  active: {
    color: theme.colors.blue[4],
  }
}));

export const ModeSelector = React.memo(({ onChangeSpace, onChangeMode, space, mode }: ModeSelector) => {
  const { classes } = useStyles()
  const [layout, setLayout] = useRecoilState(KeyboardLayoutAtom)

  return (
    <Box className={classes.selector}>
      <Tooltip label='Transformation orientation (Shortcut: Q)'>
        <Button color="dark" radius="sm" className={classes.active} onClick={onChangeSpace}>
          {space === 'local' ? <TbGizmo fontSize={'1.5rem'} /> : <BiWorld fontSize={'1.5rem'} />}
        </Button>
      </Tooltip>

      <Button.Group >
        <Tooltip label='Translate mode (Shortcut: W)'>
          <Button color="dark" radius="sm" className={mode === 'translate' ? classes.active : ''} onClick={() => onChangeMode('translate')}>
            <LuMove fontSize={'1.5rem'} />
          </Button>
        </Tooltip>

        <Tooltip label='Rotate mode (Shortcut: R)'>
          <Button color="dark" radius="sm" className={mode === 'rotate' ? classes.active : ''} onClick={() => onChangeMode('rotate')}>
            <LuRotate3D fontSize={'1.5rem'} />
          </Button>
        </Tooltip>
      </Button.Group>

      <Tooltip label={`Switch to ${layout === 'QWERTY' ? 'AZERTY' : 'QWERTY'} keyboard layout`}>
        <Button color="dark" radius="sm" leftIcon={<FaKeyboard fontSize={'1.5rem'} />} className={classes.active} onClick={() => setLayout(layout === 'QWERTY' ? 'AZERTY' : 'QWERTY')}>
          {layout}
        </Button>
      </Tooltip>
    </Box>
  )
})
