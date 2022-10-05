import { Suspense, useRef, useState, useEffect } from 'react'
import { TransformControls } from '@react-three/drei'
import { useNuiEvent } from "../../hooks/useNuiEvent"
import { fetchNui } from "../../utils/fetchNui"
import { Mesh, MathUtils } from 'three'

export const TransformComponent = (props: any) => {
    const mesh = useRef<Mesh>(null!)
    const [SelectedObject, setObject] = useState<any>()
    const [Mode, setMode] = useState<any>('translate')

    const handleObjectDataUpdate = () => {
        fetchNui('dmt:moveEntity', {
            position: { 
                x: mesh.current.position.x,
                y: -mesh.current.position.z,
                z: mesh.current.position.y
            },
            rotation: { 
                x: MathUtils.radToDeg(mesh.current.rotation.x), 
                y: MathUtils.radToDeg(-mesh.current.rotation.z), 
                z: MathUtils.radToDeg(mesh.current.rotation.y)
            },
            object: SelectedObject,
        }).catch(error => {
            console.error(error)
        })
    }

    useNuiEvent('setObjectEntities', ({position, rotation, object}: any) => {
        
        setObject(object)

        mesh.current.position.set( position.x, position.z, -position.y )
        mesh.current.rotation.order = "YZX"

        rotation && mesh.current.rotation.set( 
            MathUtils.degToRad(rotation.x),
            MathUtils.degToRad(rotation.z),
            MathUtils.degToRad(rotation.y)
        )
    })

    useEffect(() => {
        const keyHandler = (e: KeyboardEvent) => {
            if ( e.code === 'KeyR' ) {
                setMode('rotate')
            }else if ( e.code === 'KeyW') {
                setMode('translate')
            }
        }
    
        window.addEventListener('keyup', keyHandler)
        return () => window.removeEventListener('keyup', keyHandler)
    })
    
    return (
        <>
            <Suspense fallback={<p>Loading TransformController</p>}>
                {SelectedObject != null && <TransformControls object={ mesh } mode={ Mode } onObjectChange={ handleObjectDataUpdate } />}
                <mesh ref={ mesh } />
            </Suspense>
        </>
    )
}