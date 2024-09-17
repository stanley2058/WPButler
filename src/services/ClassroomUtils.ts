import { Timestamp } from "firebase/firestore";
import { LayoutUtils } from "../entities/Layout";
import FirebaseService from "./FirebaseService";
import type ILayout from "../entities/Layout";

export interface ClassroomState {
  layout: ILayout;
  studentInfo?: { id: string };
  sitting?: { row: number; col: number };
  rotation: number;
  waiting: {
    waiting: number;
    queue: number;
  };
  thisWeekHomeworkUrl?: string;
}

export default class ClassroomUtils {
  private static guideDialogOpenStateListeners: ((open: boolean) => void)[] =
    [];

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
        state.sitting.col,
      );
      state = { ...state, layout, rotation, sitting: { row, col } };
    } else state = { ...state, layout, rotation };
    return state;
  }

  static onGuideDialogClose(
    state: ClassroomState,
    id: string,
    rotation: number,
  ): ClassroomState {
    return {
      ...state,
      layout: LayoutUtils.layoutToRotation(state.layout, rotation),
      rotation,
      studentInfo: {
        id,
      },
    };
  }

  static setGuideDialogOpenState(open: boolean) {
    ClassroomUtils.guideDialogOpenStateListeners.forEach((f) => f(open));
  }
  static onGuideDialogOpenStateChange(callback: (open: boolean) => void) {
    ClassroomUtils.guideDialogOpenStateListeners.push(callback);
  }

  static getActions(state?: ClassroomState) {
    return {
      call: () => ClassroomUtils.call(state),
      cancelCall: () => ClassroomUtils.cancelCall(state),
      completeDemo: ClassroomUtils.completeDemo,
      manualDemo: ClassroomUtils.manualDemo,
    };
  }

  static call(state?: ClassroomState) {
    if (!state || !state.studentInfo || !state.sitting) return;
    FirebaseService.Instance.enqueue({
      id: state.studentInfo.id,
      rotation: state.rotation,
      sitting: state.sitting,
      appliedAt: Timestamp.now().toMillis(),
    });
  }
  static cancelCall(state?: ClassroomState) {
    if (!state || !state.studentInfo) return;
    FirebaseService.Instance.dequeue(state.studentInfo.id);
  }
  static completeDemo(points: number) {
    FirebaseService.Instance.dequeueAndEnqueueResolved(points);
  }
  static manualDemo(id: string, points: number) {
    FirebaseService.Instance.enqueueResolve(id, points);
  }
}
