import React, { useEffect, useState } from "react";
import { Grid, makeStyles } from "@material-ui/core";
import ClassroomAction from "../components/ClassroomAction";
import ClassroomLayout from "../components/ClassroomLayout";
import { INS201, INS203, INS203_201 } from "../entities/layouts";
import SeatSelectionService from "../services/SeatSelectionService";
import FirebaseService from "../services/FirebaseService";
import SeatGuideDialog from "../components/SeatGuideDialog";
import ClassroomUtils, { ClassroomState } from "../services/ClassroomUtils";
import { useHistory } from "react-router-dom";
import { LayoutUtils } from "../entities/Layout";

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
  const layouts = [
    { name: INS203_201.id, layout: INS203_201 },
    { name: INS203.id, layout: INS203 },
    { name: INS201.id, layout: INS201 },
  ];
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = useState<ClassroomState>({
    layout: INS203_201,
    rotation: 0,
    waiting: {
      waiting: 0,
      queue: -1,
    },
  });
  const [loaded, setLoaded] = useState(false);

  const setAndSaveState = (newState: ClassroomState) => {
    setState(newState);
    localStorage.setItem("classroom", JSON.stringify(newState));
  };

  useEffect(() => {
    // testing
    // FirebaseService.Instance.test();
    // testing

    const classroomRaw = localStorage.getItem("classroom");
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
        rotation,
        studentInfo,
        sitting,
        waiting: state.waiting,
      });
      ClassroomUtils.setGuideDialogOpenState(false);
    }
  }, []);

  useEffect(() => {
    console.log(state);
    if (loaded || !state.studentInfo) return;
    FirebaseService.Instance.onClassroomQueueChanged((queue) => {
      if (!queue) return;
      const index = queue.queue.findIndex(
        (q) => q.id === state.studentInfo?.id
      );
      setState({
        ...state,
        waiting: {
          waiting: queue.queue.length,
          queue: index,
        },
      });
    });

    FirebaseService.Instance.onAuthStateChanged(
      (hasLogin) => {
        setState({
          ...state,
          hasLogin,
        });
      },
      () => state.hasLogin === undefined
    );

    SeatSelectionService.Instance.register(
      "classroom-selection-listener",
      (row: number, col: number) => {
        setAndSaveState({ ...state, sitting: { row, col } });
      }
    );
    setLoaded(true);
  }, [state]);

  const onGuideDialogClose = (id: string, rotation: number) => {
    setAndSaveState(ClassroomUtils.onGuideDialogClose(state, id, rotation));
  };
  const onRotate = (clockwise: boolean) => {
    setAndSaveState(ClassroomUtils.onRotate(state, clockwise));
  };
  const actions = {
    ...ClassroomUtils.getActions(state),
    commonQuestions: () => history.push("/"),
    thisWeekHomework: () => history.push(state.thisWeekHomeworkUrl || "/"),
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
      {!state.hasLogin && (
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
            hasLogin={state.hasLogin}
            info={state.studentInfo}
            onRotate={onRotate}
            actions={actions}
          />
        </Grid>
        <Grid item xs>
          <ClassroomLayout
            layout={state.layout}
            sitting={state.sitting}
            clickable={!state.hasLogin && state.waiting.queue === -1}
          />
        </Grid>
      </Grid>
    </div>
  );
}
