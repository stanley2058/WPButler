import React, { useState } from "react";
import { Grid, makeStyles, Theme } from "@material-ui/core";
import ClassroomAction from "../components/ClassroomAction";
import ClassroomLayout from "../components/ClassroomLayout";
import ILayout, { LayoutUtils } from "../entities/Layout";
import { INS203_201 } from "../entities/layouts";
import SeatSelectionService from "../services/SeatSelectionService";
import FirebaseService from "../services/FirebaseService";
import SeatGuideDialog from "../components/SeatGuideDialog";
import ClassroomUtils from "../services/ClassroomUtils";

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

interface ClassroomState {
  layout: ILayout;
  studentInfo?: { id: string; called: boolean };
  sitting?: { row: number; col: number };
  rotation: number;
  hasLogin?: boolean;
}

export default function Classroom() {
  const classes = useStyles();
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
