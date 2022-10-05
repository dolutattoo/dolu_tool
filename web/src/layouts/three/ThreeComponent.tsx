import { Canvas } from '@react-three/fiber'

import { CameraComponent } from './CameraComponent'
import { TransformComponent } from './TransformComponent'

export const ThreeComponent = () => {
    return (
        <Canvas style={{zIndex:1}}>
            <CameraComponent position={[0,0,10]} />
            <TransformComponent />
        </Canvas>
    )
}