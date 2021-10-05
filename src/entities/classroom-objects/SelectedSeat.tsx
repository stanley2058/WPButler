import React from "react";
import { Tooltip } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { PersonPin } from "@mui/icons-material";

const useStyles = makeStyles(() => ({
  root: {
    cursor: "help",
  },
}));
export default function SelectedSeat(props: { hasLogin?: boolean }) {
  const classes = useStyles();
  if (props.hasLogin) return <PersonPin color="primary" />;
  return (
    <div className={classes.root}>
      <Tooltip title="現在的座位">
        <PersonPin color="primary" />
      </Tooltip>
    </div>
  );
}
