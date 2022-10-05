import { Suspense, useRef, useState, useEffect } from 'react'
import { TransformControls } from '@react-three/drei'
import { useNuiEvent } from "../../hooks/useNuiEvent"
import { fetchNui } from "../../utils/fetchNui"
import { Mesh, MathUtils } from 'three'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { Entity, getObjectList, ObjectListAtom } from '../../atoms/object'

export const TransformComponent = () => {
    const mesh = useRef<Mesh>(null!)
    const [currentEntity, setCurrentEntity] = useState<any>()
    const [Mode, setMode] = useState<any>('translate')
    const setEntities = useSetRecoilState(ObjectListAtom)
    const spawnedObjects = getObjectList()

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

        fetchNui('dmt:moveEntity', entity).catch(error => {console.error(error)})

    }

    useNuiEvent('setGizmoEntity', (entity: any) => {
        if (entity === null) {return}

        setCurrentEntity(entity.handle)
        mesh.current.position.set( entity.position.x, entity.position.z, -entity.position.y )
        mesh.current.rotation.order = "YZX"
        mesh.current.rotation.set( 
            MathUtils.degToRad(entity.rotation.x),
            MathUtils.degToRad(entity.rotation.z),
            MathUtils.degToRad(entity.rotation.y)
        )
    })

    useEffect(() => {
        const keyHandler = (e: KeyboardEvent) => {
            if (e.code === 'KeyR') {
                setMode('rotate')
            } else if (e.code === 'KeyW') {
                setMode('translate')
            }
        }    
        window.addEventListener('keyup', keyHandler)
        return () => window.removeEventListener('keyup', keyHandler)
    })
    
    return (
        <>
            <Suspense fallback={<p>Loading TransformController</p>}>
                {currentEntity != null && <TransformControls size={0.5} object={ mesh } mode={ Mode } onObjectChange={ handleObjectDataUpdate } />}
                <mesh ref={ mesh } />
            </Suspense>
        </>
    )
}