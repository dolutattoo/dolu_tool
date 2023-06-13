import { Canvas } from '@react-three/fiber'
import { CameraComponent } from './CameraComponent'
import { TransformComponent } from './TransformComponent'
import { ModeSelector } from './ModeSelector'
import { useState } from 'react'

export const ThreeComponent = () => {
    const [editorMode, setEditorMode] = useState<GizmoEditorMode>('translate');
    const [spaceMode, setSpaceMode] = useState<GizmoSpaceMode>('world');
    const [entity, setEntity] = useState<number>();

    const toggleSpaceMode = (): void => {
        setSpaceMode(spaceMode === 'world' ? 'local' : 'world');
    }

    return (
        <>
            <Canvas style={{ zIndex: 1 }}>
                <CameraComponent />
                <TransformComponent onChangeSpace={toggleSpaceMode} onChangeMode={setEditorMode} space={spaceMode} mode={editorMode} currentEntity={entity} setCurrentEntity={setEntity} />
            </Canvas>

            {entity && <ModeSelector onChangeSpace={toggleSpaceMode} onChangeMode={setEditorMode} space={spaceMode} mode={editorMode} />}
        </>
    )
}