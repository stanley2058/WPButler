import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flex } from "@mantine/core";
import { Swal } from "../services/SweatAlert";
import ClassroomAction from "../components/ClassroomAction";
import ClassroomLayout from "../components/ClassroomLayout";
import { INS201, INS203, INS203_201 } from "../entities/layouts";
import SeatSelectionService from "../services/SeatSelectionService";
import FirebaseService from "../services/FirebaseService";
import SeatGuideDialog from "../components/SeatGuideDialog";
import ClassroomUtils, {
  type ClassroomState,
} from "../services/ClassroomUtils";
import { LayoutUtils } from "../entities/Layout";
import { getTranslation } from "../services/I18n";

const layouts = [
  { name: INS203_201.id, layout: INS203_201 },
  { name: INS203.id, layout: INS203 },
  { name: INS201.id, layout: INS201 },
];

export default function Classroom() {
  const navigate = useNavigate();
  const getCurrentStandardLayout = () => {
    return (
      layouts.find((l) => l.name === state.layout.id) || {
        layout: INS203_201,
      }
    );
  };

  const [state, setState] = useState<ClassroomState>({
    layout: INS203_201,
    rotation: 0,
    waiting: {
      waiting: 0,
      queue: -1,
    },
  });
  const [hasLogin, setLogin] = useState<boolean | undefined>(undefined);
  const stateRef = useRef<ClassroomState>();
  const loginRef = useRef<boolean>();
  stateRef.current = state;
  loginRef.current = hasLogin;

  useEffect(() => {
    const classroomRaw = localStorage.getItem("classroom");

    const authUnSub = FirebaseService.Instance.onAuthStateChanged(
      (auth) => loginRef.current !== auth && setLogin(auth),
    );

    SeatSelectionService.Instance.register(
      "classroom-selection-listener",
      onSeatSelection,
    );

    if (classroomRaw) {
      const { layout, rotation, studentInfo, sitting } = JSON.parse(
        classroomRaw,
      ) as ClassroomState;
      if (!studentInfo && !sitting) return;
      const rLayout = layouts.find((l) => l.name === layout.id) || {
        layout: INS203_201,
      };
      setState({
        layout: LayoutUtils.layoutToRotation(rLayout.layout, rotation),
        rotation: rotation % 4,
        studentInfo,
        sitting,
        waiting: state.waiting,
      });
      ClassroomUtils.setGuideDialogOpenState(false);
      if (studentInfo && sitting) {
        FirebaseService.Instance.acquireSeat(
          studentInfo.id,
          rotation,
          sitting.row,
          sitting.col,
        );
      }
    }

    return () => {
      authUnSub();
      SeatSelectionService.Instance.unregister("classroom-selection-listener");
    };
  }, []);

  useEffect(() => {
    if (hasLogin === undefined) return;
    const classTimeUnSub = FirebaseService.Instance.onClassTimeChanged(
      (isSessionAlive, classTime) => {
        if (!isSessionAlive && !hasLogin) {
          if (stateRef.current?.waiting.queue !== -1) {
            fireClassEndAwaitingDemoNotice().then(() => {
              if (stateRef.current?.studentInfo?.id) {
                FirebaseService.Instance.dequeue(
                  stateRef.current.studentInfo.id,
                );
              }
              navigate("/");
            });
          } else {
            ClassroomUtils.setGuideDialogOpenState(false);
            fireClassEndNotice().then(() => navigate("/"));
          }
        } else {
          if (classTime?.thisWeekHomeworkUrl && stateRef.current) {
            setState({
              ...stateRef.current,
              thisWeekHomeworkUrl: classTime.thisWeekHomeworkUrl,
            });
          }
        }
      },
    );
    const classroomQueueUnSub =
      FirebaseService.Instance.onClassroomQueueChanged(async (queue) => {
        await FirebaseService.Instance.isDataReady();
        if (!queue || !stateRef.current) return;
        const index = queue.queue.findIndex(
          (q) => q.id === stateRef.current?.studentInfo?.id,
        );
        let newState: ClassroomState = {
          ...stateRef.current,
          waiting: {
            waiting: queue.queue.length,
            queue: index,
          },
        };

        if (hasLogin) {
          const currentAvailableStudent =
            FirebaseService.Instance.currentAvailableStudent;
          if (currentAvailableStudent) {
            const { id, sitting, rotation } = currentAvailableStudent;
            const { col, row } = LayoutUtils.translateLocationToStandard(
              getCurrentStandardLayout().layout,
              rotation,
              sitting.row,
              sitting.col,
            );

            newState = {
              ...newState,
              studentInfo: {
                id,
              },
              sitting: LayoutUtils.translateLocationToRotation(
                getCurrentStandardLayout().layout,
                stateRef.current.rotation,
                row,
                col,
              ),
            };
          } else {
            newState = {
              ...newState,
              studentInfo: undefined,
              sitting: undefined,
            };
          }
        }
        setState(newState);
      });
    return () => {
      classTimeUnSub();
      classroomQueueUnSub.then((unSub) => unSub && unSub());

      const currentStudent = FirebaseService.Instance.currentAvailableStudent;
      if (currentStudent) {
        FirebaseService.Instance.release(currentStudent.id);
      }
    };
  }, [hasLogin]);

  const setAndSaveState = (newState: ClassroomState) => {
    setState(newState);
    localStorage.setItem("classroom", JSON.stringify(newState));
  };
  const onSeatSelection = (row: number, col: number) => {
    const id = stateRef.current?.studentInfo?.id;
    if (!stateRef.current || !id) return;
    const rotation = stateRef.current.rotation;
    setAndSaveState({ ...stateRef.current, sitting: { row, col } });
    FirebaseService.Instance.acquireSeat(id, rotation, row, col);
  };
  const onGuideDialogClose = (id: string, rotation: number) => {
    if (!stateRef.current) return;
    setAndSaveState(
      ClassroomUtils.onGuideDialogClose(stateRef.current, id, rotation),
    );
  };
  const onRotate = (clockwise: boolean) => {
    if (!stateRef.current) return;
    setAndSaveState(ClassroomUtils.onRotate(stateRef.current, clockwise));
  };
  const actions = {
    ...ClassroomUtils.getActions(stateRef.current),
    resetSeat: () => {
      setAndSaveState({
        layout: INS203_201,
        rotation: 0,
        waiting: state.waiting,
      });
      ClassroomUtils.setGuideDialogOpenState(true);
    },
  };

  return (
    <Flex pos="relative" justify="center" top="1rem" pb="1rem">
      {!hasLogin && (
        <SeatGuideDialog
          open={!state.studentInfo}
          onClose={onGuideDialogClose}
        />
      )}
      <Flex
        direction="column"
        style={{ maxWidth: "min(30rem, 100%)", width: "100%" }}
      >
        <ClassroomAction
          queue={state.waiting.queue}
          waiting={state.waiting.waiting}
          hasLogin={hasLogin}
          info={state.studentInfo}
          onRotate={onRotate}
          actions={actions}
          data={{ thisWeekHomeworkUrl: state.thisWeekHomeworkUrl }}
        />
        <ClassroomLayout
          layout={state.layout}
          sitting={state.sitting}
          clickable={!hasLogin && state.waiting.queue === -1}
        />
      </Flex>
    </Flex>
  );
}

function fireClassEndAwaitingDemoNotice() {
  const i18n = getTranslation();
  return Swal.fire({
    icon: "info",
    title: i18n.t("classroom.classEnded.title"),
    text: i18n.t("classroom.classEnded.awaiting"),
    allowOutsideClick: false,
    confirmButtonColor: "red",
    confirmButtonText: i18n.t("classroom.classEnded.leaveQueue"),
  });
}

function fireClassEndNotice() {
  const i18n = getTranslation();
  return Swal.fire({
    icon: "info",
    title: i18n.t("classroom.classEnded.title"),
    text: i18n.t("classroom.classEnded.reminder"),
  });
}
