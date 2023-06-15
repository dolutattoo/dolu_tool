/// <reference types='vite/client' />

type GizmoEditorMode = "translate" | "rotate" | "scale" | undefined;
type GizmoSpaceMode = "world" | "local";

interface ModeSelector {
  onChangeSpace: () => void;
  onChangeMode: (value: GizmoEditorMode) => void;
  space: GizmoSpaceMode;
  mode: GizmoEditorMode;
}


interface TransformComponent extends ModeSelector {
  currentEntity: string | number | undefined;
  setCurrentEntity: (value: number) => void;
}