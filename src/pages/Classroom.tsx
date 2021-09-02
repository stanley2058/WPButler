import React, { useState } from "react";
import { Grid, makeStyles, Theme } from "@material-ui/core";
import ClassroomAction from "../components/ClassroomAction";
import ClassroomLayout from "../components/ClassroomLayout";
import { INS203_201 } from "../entities/layouts";
import SeatSelectionService from "../services/SeatSelectionService";
import FirebaseService from "../services/FirebaseService";
import SeatGuideDialog from "../components/SeatGuideDialog";
import ClassroomUtils, { ClassroomState } from "../services/ClassroomUtils";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) => ({
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
  const [state, setState] = useState<ClassroomState>({
    layout: INS203_201,
    rotation: 0,
  });
  // TODO: add service to deal with actions and update ui

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
      setState({ ...state, sitting: { row, col } });
    }
  );

  const onGuideDialogClose = (id: string, rotation: number) => {
    setState(ClassroomUtils.onGuideDialogClose(state, id, rotation));
  };
  const onRotate = (clockwise: boolean) => {
    setState(ClassroomUtils.onRotate(state, clockwise));
  };
  const actions = {
    ...ClassroomUtils.getActions(state),
    commonQuestions: () => history.push("/"),
    thisWeekHomework: () => history.push(state.thisWeekHomeworkUrl || "/"),
    resetSeat: () => {
      setState({
        layout: INS203_201,
        rotation: 0,
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
            clickable={!state.hasLogin}
          />
        </Grid>
      </Grid>
    </div>
  );
}
