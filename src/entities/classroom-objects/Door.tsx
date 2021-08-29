import { makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "limegreen",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    placeItems: "center",
  },
}));
export default function Door() {
  const classes = useStyles();
  return <div className={classes.root}>門</div>;
}
