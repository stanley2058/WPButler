import React from "react";
import { makeStyles, Tooltip } from "@material-ui/core";
import { PersonPin } from "@material-ui/icons";

const useStyles = makeStyles(() => ({
  root: {
    cursor: "help",
  },
}));
export default function SelectedSeat() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Tooltip title="現在的座位">
        <PersonPin color="primary" />
      </Tooltip>
    </div>
  );
}
