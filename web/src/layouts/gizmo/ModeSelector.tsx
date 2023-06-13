import { Box, Button, createStyles } from "@mantine/core"
import { BiWorld } from "react-icons/bi";
import { LuRotate3D, LuMove } from "react-icons/lu"
import { TbGizmo } from "react-icons/tb";

const useStyles = createStyles((theme) => ({
    selector: {
        display: 'flex',
        position: 'absolute',
        color: theme.colors.dark[1],
        justifyContent: 'center',
        alignItems: 'center',
        bottom: '2rem',
        gap: '1rem',
        zIndex: 2,
    },
    active: {
        color: theme.colors.blue[4],
    }
}))

export const ModeSelector = ({ onChangeSpace, onChangeMode, space, mode }: ModeSelector) => {
    const { classes } = useStyles();

    return (
        <>
            <Box className={classes.selector}>

                <Button color="dark" radius="xl" className={space === 'local' ? classes.active : ''} onClick={onChangeSpace}>
                    {space === 'local' ? <TbGizmo fontSize={'1.5rem'} /> : <BiWorld fontSize={'1.5rem'} />}
                </Button>

                <Button.Group >
                    <Button color="dark" radius="xl" className={mode === 'translate' ? classes.active : ''} onClick={() => onChangeMode('translate')}>
                        <LuMove fontSize={'1.5rem'} />
                    </Button>
                    <Button color="dark" radius="xl" className={mode === 'rotate' ? classes.active : ''} onClick={() => onChangeMode('rotate')}>
                        <LuRotate3D fontSize={'1.5rem'} />
                    </Button>
                </Button.Group>
            </Box>
        </>
    )

}