import { Suspense, useRef, useState, useEffect } from 'react'
import { TransformControls } from '@react-three/drei'
import { useNuiEvent } from '../../hooks/useNuiEvent'
import { fetchNui } from '../../utils/fetchNui'
import { Mesh, MathUtils } from 'three'

export const TransformComponent = ({ onChangeSpace, onChangeMode, space, mode, currentEntity, setCurrentEntity }: TransformComponent) => {
    const mesh = useRef<Mesh>(null!)
    
    const handleObjectDataUpdate = () => {
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
    }

    useNuiEvent('setGizmoEntity', (entity: any) => {
        setCurrentEntity(entity.handle)
        if (entity.handle === undefined) {return}

        mesh.current.position.set(entity.position.x, entity.position.z, -entity.position.y)
        mesh.current.rotation.order = 'YZX'
        mesh.current.rotation.set(MathUtils.degToRad(entity.rotation.x), MathUtils.degToRad(entity.rotation.z), MathUtils.degToRad(entity.rotation.y))
    })

    useEffect(() => {
        const keyHandler = (e: KeyboardEvent) => {
            if (e.code === 'KeyR' && mode !== 'rotate') {
                onChangeMode('rotate')
            } 

            if (mode !== 'translate' && ((navigator.language.startsWith('fr') && e.code === 'KeyW') || e.code === 'KeyZ' ) ) {
                onChangeMode('translate');
            }

            if (e.code === 'KeyQ' ) {
                onChangeSpace()
            }
        }    
        window.addEventListener('keyup', keyHandler)
        return () => window.removeEventListener('keyup', keyHandler)
    }, [ mode, onChangeSpace, onChangeMode ])
    
    return (
        <>
            <Suspense fallback={<p>Loading Gizmo</p>}>
                {currentEntity != null && <TransformControls space={space} size={0.5} object={mesh} mode={mode} onObjectChange={handleObjectDataUpdate} />}
                <mesh ref={ mesh } />
            </Suspense>
        </>
    )
}