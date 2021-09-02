import ILayout, { LayoutUtils } from "../entities/Layout";

export interface ClassroomState {
  layout: ILayout;
  studentInfo?: { id: string; called: boolean };
  sitting?: { row: number; col: number };
  rotation: number;
  hasLogin?: boolean;
}

export default class ClassroomUtils {
  static onRotate(state: ClassroomState, clockwise: boolean): ClassroomState {
    const rotation = clockwise ? state.rotation + 1 : state.rotation - 1;
    const rotateFunc = clockwise
      ? LayoutUtils.rotateClockwise
      : LayoutUtils.rotateCounterclockwise;

    const layout = rotateFunc(state.layout);
    if (state.sitting) {
      const translateFunc = clockwise
        ? LayoutUtils.translateLocationClockwise
        : LayoutUtils.translateLocationCounterclockwise;

      const { row, col } = translateFunc(
        state.layout,
        state.sitting.row,
        state.sitting.col
      );
      state = { ...state, layout, rotation, sitting: { row, col } };
    } else state = { ...state, layout, rotation };
    return state;
  }

  static onGuideDialogClose(
    state: ClassroomState,
    id: string,
    rotation: number
  ): ClassroomState {
    return {
      ...state,
      layout: LayoutUtils.layoutToRotation(state.layout, rotation),
      rotation,
      studentInfo: {
        id,
        called: false,
      },
    };
  }
}
