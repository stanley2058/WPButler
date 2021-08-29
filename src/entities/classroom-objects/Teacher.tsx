import { makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "violet",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    placeItems: "center",
  },
}));
export default function Teacher() {
  const classes = useStyles();
  return <div className={classes.root}>老師</div>;
}
