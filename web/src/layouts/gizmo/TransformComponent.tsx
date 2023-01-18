import { Suspense, useRef, useState, useEffect } from 'react'
import { TransformControls } from '@react-three/drei'
import { useNuiEvent } from '../../hooks/useNuiEvent'
import { fetchNui } from '../../utils/fetchNui'
import { Mesh, MathUtils } from 'three'

export const TransformComponent = () => {
    const mesh = useRef<Mesh>(null!)
    const [currentEntity, setCurrentEntity] = useState<number>()
    const [editorMode, setEditorMode] = useState<'translate' | 'rotate' | 'scale' | undefined>('translate')

    const handleObjectDataUpdate = () => {
        const entity = {
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
        }
        fetchNui('dolu_tool:moveEntity', entity)
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
            if (e.code === 'KeyR') {
                setEditorMode('rotate')
            } else {
                if (navigator.language.startsWith('fr')) {
                    if (e.code === 'KeyW') { // AZERTY
                        setEditorMode('translate')
                    }
                } else {
                    if (e.code === 'KeyZ') { // QWERTY
                        setEditorMode('translate')
                    }
                }
            }
        }    
        window.addEventListener('keyup', keyHandler)
        return () => window.removeEventListener('keyup', keyHandler)
    })
    
    return (
        <>
            <Suspense fallback={<p>Loading Gizmo</p>}>
                {currentEntity != null && <TransformControls size={0.5} object={ mesh } mode={ editorMode } onObjectChange={ handleObjectDataUpdate } />}
                <mesh ref={ mesh } />
            </Suspense>
        </>
    )
}