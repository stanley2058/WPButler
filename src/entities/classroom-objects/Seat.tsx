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
  color: number;
  clickable?: boolean;
}) {
  const classes = useStyles();
  const displayColor = props.color === 1 ? "action" : "info";
  const tooltipText =
    props.color === 1 ? "移動到這裡" : "移動到這裡 (橫向座位)";

  if (!props.clickable) return <EventSeat color={displayColor} />;
  return (
    <a
      className={classes.root}
      onClick={() => {
        SeatSelectionService.Instance.emitSelection(props.row, props.col);
      }}
    >
      <Tooltip title={tooltipText}>
        <EventSeat color={displayColor} />
      </Tooltip>
    </a>
  );
}
