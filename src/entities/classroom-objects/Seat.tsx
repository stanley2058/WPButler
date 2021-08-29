import React from "react";
import { makeStyles, Tooltip } from "@material-ui/core";
import { EventSeat } from "@material-ui/icons";
import SeatSelectionService from "../../services/SeatSelectionService";

const useStyles = makeStyles(() => ({
  root: {
    cursor: "pointer",
  },
}));
export default function Seat(props: { row: number; col: number }) {
  const classes = useStyles();
  return (
    <a
      className={classes.root}
      onClick={(e) => {
        SeatSelectionService.Instance.emitSelection(props.row, props.col);
      }}
    >
      <Tooltip title="移動到這裡">
        <EventSeat fontSize="large" color="secondary" />
      </Tooltip>
    </a>
  );
}
