import React, { useState } from "react";
import { Grid, makeStyles, Theme } from "@material-ui/core";
import ClassroomAction from "../components/ClassroomAction";
import ClassroomLayout from "../components/ClassroomLayout";
import ILayout from "../entities/Layout";
import { INS201, INS203 } from "../entities/layouts";
import SeatSelectionService from "../services/SeatSelectionService";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: "relative",
    top: "2em",
    display: "flex",
    justifyContent: "center",
  },
  grid: {
    maxWidth: "30em",
  },
  action: {
    marginBottom: "1em",
  },
}));
export default function Classroom() {
  const classes = useStyles();
  const [state, setState] = useState<{
    layout: ILayout;
    studentInfo?: { id: string; called: boolean };
    sitting?: { row: number; col: number };
  }>({
    layout: INS203,
    studentInfo: { id: "10957032", called: false },
  });

  SeatSelectionService.Instance.register(
    "classroom-selection-listener",
    (row: number, col: number) => {
      setState({ ...state, sitting: { row, col } });
    }
  );

  return (
    <div className={classes.root}>
      <Grid container direction="column" className={classes.grid}>
        <Grid item xs className={classes.action}>
          <ClassroomAction info={state.studentInfo} />
        </Grid>
        <Grid item xs>
          <ClassroomLayout layout={state.layout} sitting={state.sitting} />
        </Grid>
      </Grid>
    </div>
  );
}
