import React from "react";
import { Tooltip } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { EventSeat } from "@mui/icons-material";
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
  if (!props.clickable) return <EventSeat color="action" />;
  return (
    <a
      className={classes.root}
      onClick={() => {
        SeatSelectionService.Instance.emitSelection(props.row, props.col);
      }}
    >
      <Tooltip title="移動到這裡">
        <EventSeat color="action" />
      </Tooltip>
    </a>
  );
}
