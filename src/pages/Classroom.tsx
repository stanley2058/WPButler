import React, { useState } from "react";
import { Grid, makeStyles, Theme } from "@material-ui/core";
import ClassroomAction from "../components/ClassroomAction";
import ClassroomLayout from "../components/ClassroomLayout";
import ILayout, { LayoutUtils } from "../entities/Layout";
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
}));
export default function Classroom() {
  const classes = useStyles();
  const [state, setState] = useState<{
    layout: ILayout;
    studentInfo?: { id: string; called: boolean };
    sitting?: { row: number; col: number };
    rotation: number;
  }>({
    layout: INS203,
    rotation: 0,
    studentInfo: { id: "10957032", called: false },
  });
  // TODO: add service to deal with actions and update ui

  SeatSelectionService.Instance.register(
    "classroom-selection-listener",
    (row: number, col: number) => {
      setState({ ...state, sitting: { row, col } });
    }
  );

  return (
    <div className={classes.root}>
      <Grid container direction="column" className={classes.grid}>
        <Grid item xs>
          <ClassroomAction
            info={state.studentInfo}
            onRotate={(clockwise: boolean) => {
              const rotation = clockwise
                ? state.rotation + 1
                : state.rotation - 1;
              const layout = clockwise
                ? LayoutUtils.rotateClockwise(state.layout)
                : LayoutUtils.rotateCounterclockwise(state.layout);
              if (state.sitting) {
                const { row, col } = clockwise
                  ? LayoutUtils.translateLocationClockwise(
                      state.layout,
                      state.sitting.row,
                      state.sitting.col
                    )
                  : LayoutUtils.translateLocationCounterclockwise(
                      state.layout,
                      state.sitting.row,
                      state.sitting.col
                    );
                setState({ ...state, layout, rotation, sitting: { row, col } });
              } else setState({ ...state, layout, rotation });
            }}
          />
        </Grid>
        <Grid item xs>
          <ClassroomLayout layout={state.layout} sitting={state.sitting} />
        </Grid>
      </Grid>
    </div>
  );
}
