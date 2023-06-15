import React, { useCallback, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { CameraComponent } from './CameraComponent'
import { TransformComponent } from './TransformComponent'
import { ModeSelector } from './ModeSelector'
import { fetchNui } from '../../utils/fetchNui'

export const ThreeComponent = React.memo(() => {
    const [editorMode, setEditorMode] = useState<GizmoEditorMode>('translate');
    const [spaceMode, setSpaceMode] = useState<GizmoSpaceMode>('world');
    const [entity, setEntity] = useState< number| undefined >();
    const [drag, setDrag] = useState<boolean >(false);

    const toggleSpaceMode = useCallback((): void => {
        setSpaceMode(spaceMode === 'world' ? 'local' : 'world');
    }, [spaceMode]);

    const keyHandler = useCallback((e: KeyboardEvent): void => {
        if (e.code === 'KeyR' && editorMode !== 'rotate') {
            setEditorMode('rotate')
        }

        if (editorMode !== 'translate' && ((navigator.language.startsWith('fr') && e.code === 'KeyW') || e.code === 'KeyZ')) {
            setEditorMode('translate');
        }

        if (e.code === 'KeyQ') {
            toggleSpaceMode()
        }
    }, [editorMode, spaceMode])    

    const mouseHandler = useCallback((e: any): void => {
        if (e.target?.tagName !== 'CANVAS' || e.button !== 0 || drag) return;
        fetchNui('dolu_tool:selectEntity');
    }, [drag]);

    const setDragging = useCallback((value: boolean): void => setDrag(value), [drag]);

    useEffect(() => {
        window.addEventListener('keyup', keyHandler)
        window.addEventListener('mousedown', mouseHandler);

        return () => {
            window.removeEventListener('keyup', keyHandler);
            window.removeEventListener('mousedown', mouseHandler);
        }
    }, [editorMode, spaceMode, toggleSpaceMode, setEditorMode, mouseHandler])

    return (
        <>
            <Canvas style={{ zIndex: 1 }}>
                <CameraComponent />
                <TransformComponent onMouseUp={() => setDragging(false)} onMouseDown={ () => setDragging(true) } onChangeSpace={toggleSpaceMode} onChangeMode={setEditorMode} space={spaceMode} mode={editorMode} currentEntity={entity} setCurrentEntity={setEntity} />
            </Canvas>

            {entity && <ModeSelector onChangeSpace={toggleSpaceMode} onChangeMode={setEditorMode} space={spaceMode} mode={editorMode} />}
        </>
    )
});