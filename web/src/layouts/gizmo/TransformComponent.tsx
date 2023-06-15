import React, { Suspense, useRef, useCallback } from 'react'
import { TransformControls } from '@react-three/drei'
import { useNuiEvent } from '../../hooks/useNuiEvent'
import { fetchNui } from '../../utils/fetchNui'
import { Mesh, MathUtils } from 'three'

export const TransformComponent = React.memo(({ space, mode, currentEntity, setCurrentEntity, onMouseUp, onMouseDown }: TransformComponent) => {
    const mesh = useRef<Mesh>(null!)

    useNuiEvent<TransformEntity>('setGizmoEntity', (entity: TransformEntity): void => {
        setCurrentEntity(entity.handle)
        if (entity.handle === undefined) { return }

        mesh.current.rotation.order = 'YZX'
        mesh.current.position.set(entity.position.x, entity.position.z, -entity.position.y)
        mesh.current.rotation.set(MathUtils.degToRad(entity.rotation.x), MathUtils.degToRad(entity.rotation.z), MathUtils.degToRad(entity.rotation.y))
    });

    const handleObjectDataUpdate = useCallback((): void => {
        fetchNui('dolu_tool:moveEntity', {
            handle: currentEntity,
            position: {
                x: mesh.current.position.x,
                y: -mesh.current.position.z,
                z: mesh.current.position.y
            },
            rotation: {
                x: MathUtils.radToDeg(mesh.current.rotation.x),
                y: MathUtils.radToDeg(-mesh.current.rotation.z),
                z: MathUtils.radToDeg(mesh.current.rotation.y)
            }
        })
    }, [mesh, currentEntity]);
    
    return (
        <>
            <Suspense fallback={<p>Loading Gizmo</p>}>
                {currentEntity != null && <TransformControls onMouseUp={onMouseUp} onMouseDown={onMouseDown} space={space} size={0.5} object={mesh} mode={mode} onObjectChange={handleObjectDataUpdate} />}
                <mesh ref={ mesh } />
            </Suspense>
        </>
    )
});