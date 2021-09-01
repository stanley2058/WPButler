import React from "react";
import { makeStyles, Tooltip } from "@material-ui/core";
import { EventSeat } from "@material-ui/icons";
import SeatSelectionService from "../../services/SeatSelectionService";

const useStyles = makeStyles(() => ({
  root: {
    cursor: "pointer",
  },
}));
export default function Seat(props: {
  row: number;
  col: number;
  clickable?: boolean;
}) {
  const classes = useStyles();
  if (!props.clickable) return <EventSeat color="secondary" />;
  return (
    <a
      className={classes.root}
      onClick={() => {
        SeatSelectionService.Instance.emitSelection(props.row, props.col);
      }}
    >
      <Tooltip title="移動到這裡">
        <EventSeat color="secondary" />
      </Tooltip>
    </a>
  );
}
