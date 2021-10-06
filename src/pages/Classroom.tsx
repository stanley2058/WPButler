import React, { useEffect, useRef, useState } from "react";
import { Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import ClassroomAction from "../components/ClassroomAction";
import ClassroomLayout from "../components/ClassroomLayout";
import { INS201, INS203, INS203_201 } from "../entities/layouts";
import SeatSelectionService from "../services/SeatSelectionService";
import FirebaseService from "../services/FirebaseService";
import SeatGuideDialog from "../components/SeatGuideDialog";
import ClassroomUtils, { ClassroomState } from "../services/ClassroomUtils";
import { useHistory } from "react-router-dom";
import { LayoutUtils } from "../entities/Layout";
import Swal from "sweetalert2";

const useStyles = makeStyles(() => ({
  root: {
    position: "relative",
    top: "2em",
    display: "flex",
    justifyContent: "center",
    paddingBottom: "1em",
  },
  grid: {
    maxWidth: "30em",
  },
}));

export default function Classroom() {
  const classes = useStyles();
  const history = useHistory();

  const layouts = [
    { name: INS203_201.id, layout: INS203_201 },
    { name: INS203.id, layout: INS203 },
    { name: INS201.id, layout: INS201 },
  ];
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
      (auth) => loginRef.current !== auth && setLogin(auth)
    );

    SeatSelectionService.Instance.register(
      "classroom-selection-listener",
      onSeatSelection
    );

    if (classroomRaw) {
      const { layout, rotation, studentInfo, sitting } = JSON.parse(
        classroomRaw
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
            Swal.fire({
              icon: "info",
              title: "課程時間已結束",
              text: "Demo尚在等待佇列中，在完成Demo前請勿關閉本頁。",
              allowOutsideClick: false,
              confirmButtonColor: "red",
              confirmButtonText: "離開佇列",
            }).then(() => {
              if (stateRef.current?.studentInfo?.id)
                FirebaseService.Instance.dequeue(
                  stateRef.current.studentInfo.id
                );
              history.push("/");
            });
          } else {
            Swal.fire({
              icon: "info",
              title: "課程時間已結束",
              text: "請將作業保存帶走，並在離開教室前關閉電腦。",
            }).then(() => history.push("/"));
          }
        } else {
          if (classTime?.thisWeekHomeworkUrl && stateRef.current) {
            setState({
              ...stateRef.current,
              thisWeekHomeworkUrl: classTime.thisWeekHomeworkUrl,
            });
          }
        }
      }
    );
    const classroomQueueUnSub =
      FirebaseService.Instance.onClassroomQueueChanged(async (queue) => {
        await FirebaseService.Instance.isDataReady();
        if (!queue || !stateRef.current) return;
        const index = queue.queue.findIndex(
          (q) => q.id === stateRef.current?.studentInfo?.id
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
              sitting.col
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
                col
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
    if (!stateRef.current) return;
    setAndSaveState({ ...stateRef.current, sitting: { row, col } });
  };
  const onGuideDialogClose = (id: string, rotation: number) => {
    if (!stateRef.current) return;
    setAndSaveState(
      ClassroomUtils.onGuideDialogClose(stateRef.current, id, rotation)
    );
  };
  const onRotate = (clockwise: boolean) => {
    if (!stateRef.current) return;
    setAndSaveState(ClassroomUtils.onRotate(stateRef.current, clockwise));
  };
  const actions = {
    ...ClassroomUtils.getActions(stateRef.current),
    commonQuestions: () =>
      window.open("https://hackmd.io/@stanley2058/HJm6o4xEF", "_blank"),
    thisWeekHomework: () =>
      window.open(stateRef.current?.thisWeekHomeworkUrl || "/"),
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
    <div className={classes.root}>
      {!hasLogin && (
        <SeatGuideDialog
          open={!state.studentInfo}
          onClose={onGuideDialogClose}
        />
      )}
      <Grid container direction="column" className={classes.grid}>
        <Grid item xs>
          <ClassroomAction
            queue={state.waiting.queue}
            waiting={state.waiting.waiting}
            hasLogin={hasLogin}
            info={state.studentInfo}
            onRotate={onRotate}
            actions={actions}
          />
        </Grid>
        <Grid item xs>
          <ClassroomLayout
            layout={state.layout}
            sitting={state.sitting}
            clickable={!hasLogin && state.waiting.queue === -1}
          />
        </Grid>
      </Grid>
    </div>
  );
}
