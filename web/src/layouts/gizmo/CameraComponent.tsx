import { PerspectiveCamera } from '@react-three/drei'
import { useNuiEvent } from '../../hooks/useNuiEvent'
import { useThree } from '@react-three/fiber'
import { MathUtils } from 'three'

export const CameraComponent = () => {
    const { camera } = useThree()

    const zRotationHandler = (t: number,e: number) => {
        return t > 0 && t < 90 ? e : (t > -180 && t < -90) || t > 0 ? -e : e
    }

    useNuiEvent('setCameraPosition', ({ position, rotation }: any) => {
        camera.position.set( position.x, position.z, -position.y )
        camera.rotation.order = 'YZX'

        rotation && camera.rotation.set(
            MathUtils.degToRad(rotation.x),
            MathUtils.degToRad(zRotationHandler(rotation.x, rotation.z)),
            MathUtils.degToRad(rotation.y)
        )

        camera.updateProjectionMatrix()
    })
    
    return (
        <PerspectiveCamera position={[0,0,10]} makeDefault onUpdate={(self: any) => self.updateProjectionMatrix()} />
    )
}