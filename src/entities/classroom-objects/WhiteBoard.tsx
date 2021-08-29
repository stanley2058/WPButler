import { makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: "lightgray",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    placeItems: "center",
  },
}));
export default function WhiteBoard() {
  const classes = useStyles();
  return <div className={classes.root}>白板</div>;
}
