import React, { Suspense, useRef, useCallback, useState, useEffect } from 'react'
import { TransformControls } from '@react-three/drei'
import { Mesh, MathUtils } from 'three'
import { useRecoilValue } from 'recoil'
import { useNuiEvent } from '../../hooks/useNuiEvent'
import { fetchNui } from '../../utils/fetchNui'
import { RotateSnapAtom, TranslateSnapAtom } from '../../atoms/object'

export const TransformComponent = React.memo(({ space, mode, currentEntity, setCurrentEntity, onMouseUp, onMouseDown }: TransformComponent) => {
  const mesh = useRef<Mesh>(null!);
  const translateSnap = useRecoilValue(TranslateSnapAtom);
  const rotateSnap = useRecoilValue(RotateSnapAtom);
  const [shiftPressed, setShiftPressed] = useState(false);

  useNuiEvent<TransformEntity>('setGizmoEntity', (entity: TransformEntity | undefined): void => {
    setCurrentEntity(entity);
    if (!entity || !entity.handle || !entity.position || !entity.rotation) {
      return;
    };

    mesh.current.rotation.order = 'YZX'
    mesh.current.position.set(entity.position.x, entity.position.z, -entity.position.y);
    mesh.current.rotation.set(MathUtils.degToRad(entity.rotation.x), MathUtils.degToRad(entity.rotation.z), MathUtils.degToRad(-entity.rotation.y));
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey) {
        setShiftPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.shiftKey) {
        setShiftPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleObjectDataUpdate = useCallback((): void => {
    fetchNui('dolu_tool:moveEntity', {
      name: currentEntity?.name,
      hash: currentEntity?.hash,
      handle: currentEntity?.handle,
      id: currentEntity?.id,
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
    });
  }, [mesh, currentEntity?.handle, currentEntity?.id]);

  const handleMouseDown = useCallback(() => {
    onMouseDown?.()

    // If SHIFT is pressed and in translate mode, duplicate the entity
    if (shiftPressed && mode === 'translate' && currentEntity?.id) {
      fetchNui('dolu_tool:duplicateEntity', {
        entityId: currentEntity.id,
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
      });
    }
  }, [shiftPressed, mode, currentEntity, mesh, onMouseDown]);

  const handleMouseUp = useCallback(() => {
    onMouseUp?.();
  }, [onMouseUp]);

  return (
    <>
      <Suspense fallback={<p>Loading Gizmo</p>}>
        {currentEntity?.handle && <TransformControls onMouseUp={handleMouseUp} onMouseDown={handleMouseDown} space={space} size={0.5} object={mesh} mode={mode} translationSnap={translateSnap} rotationSnap={rotateSnap} onObjectChange={handleObjectDataUpdate} />}
        <mesh ref={mesh} />
      </Suspense>
    </>
  )
});
