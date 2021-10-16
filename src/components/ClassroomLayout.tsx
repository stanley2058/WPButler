import React from "react";
import ILayout from "../entities/Layout";
import { makeStyles, createStyles, styled } from "@mui/styles";
import { Grid } from "@mui/material";
import Seat from "../entities/classroom-objects/Seat";
import Space from "../entities/classroom-objects/Space";
import SelectedSeat from "../entities/classroom-objects/SelectedSeat";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      textAlign: "center",
    },
    leftAndRightGrid: {
      height: "100%",
    },
    leftAndRight: {
      maxWidth: "100%",
      maxHeight: "100%",
      width: "100%",
      writingMode: "vertical-lr",
    },
    seatBase: {
      flexDirection: "column",
      paddingTop: "1em",
      paddingBottom: "1em",
    },
    seatRow: {
      width: "100%",
      display: "flex",
      justifyContent: "space-evenly",
    },
  })
);

export default function ClassroomLayout(props: {
  layout: ILayout;
  sitting?: { row: number; col: number };
  clickable?: boolean;
}) {
  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <Grid container>
        {props.layout.scenes.top.map((e, id) => (
          <Grid key={"top-" + id} item xs={e.width}>
            {e.element}
          </Grid>
        ))}
      </Grid>
      <Grid container>
        <Grid item xs={1}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            direction="column"
            className={classes.leftAndRightGrid}
          >
            {props.layout.scenes.left.map((e, id) => (
              <Grid
                key={"left-" + id}
                className={classes.leftAndRight}
                item
                xs={e.width}
              >
                {e.element}
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs>
          <Grid
            container
            className={classes.seatBase}
            sx={{ flexDirection: "column" }}
          >
            {props.layout.seats.map((row, id) => (
              <Grid item xs key={"row-" + id} className={classes.seatRow}>
                {row.map((s, sid) => {
                  if (
                    props.sitting &&
                    props.sitting.row === id &&
                    props.sitting.col === sid
                  ) {
                    return (
                      <SelectedSeat hasLogin={!props.clickable} key={sid} />
                    );
                  }
                  return s ? (
                    <Seat
                      row={id}
                      col={sid}
                      color={s}
                      clickable={props.clickable}
                      key={sid}
                    />
                  ) : (
                    <Space key={sid} />
                  );
                })}
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={1}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            direction="column"
            className={classes.leftAndRightGrid}
          >
            {props.layout.scenes.right.map((e, id) => (
              <Grid
                className={classes.leftAndRight}
                key={"right-" + id}
                item
                xs={e.width}
              >
                {e.element}
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <Grid container>
        {props.layout.scenes.bottom.map((e, id) => (
          <Grid key={"bottom-" + id} item xs={e.width}>
            {e.element}
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
