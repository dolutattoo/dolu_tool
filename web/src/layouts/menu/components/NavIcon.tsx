import { ActionIcon, createStyles, Tooltip } from '@mantine/core'
import { FloatingPosition } from '@mantine/core/lib/Floating'
import { IconBaseProps } from 'react-icons'
import { Link, useLocation } from 'react-router-dom'

interface Props {
  tooltip: string
  to: string
  Icon: React.ComponentType<IconBaseProps>
  color?: string
  hoverColor?: string
  handleClick?: () => void
  toolTipPosition?: FloatingPosition
}

const useStyles = createStyles((theme, color) => ({
  icon: {
    width: 50,
    height: 50,
    transition: '300ms',
  },
}))

const NavIcon: React.FC<Props> = ({ tooltip, Icon, color, to, handleClick, toolTipPosition }) => {
  const { classes } = useStyles()
  const location = useLocation()

  return (
    <Tooltip label={tooltip} position={toolTipPosition ? toolTipPosition : 'right'}>
      <ActionIcon
        onClick={() => {
          if (handleClick) return handleClick()
        }}
        size='md'
        component={Link}
        to={to}
        color={color ? color : 'blue.4'}
        className={classes.icon}
        variant={location.pathname === to ? 'light' : 'transparent'}
        sx={(theme) => ({
          '&:hover': {
            color: theme.colors.gray[6] ? color  : 'blue.4',
            backgroundColor: location.pathname !== to ? theme.colors.dark[6] : undefined,
          },
        })}
      >
        <Icon fontSize={24} />
      </ActionIcon>
    </Tooltip>
  )
}

export default NavIcon
