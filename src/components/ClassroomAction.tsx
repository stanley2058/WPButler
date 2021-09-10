import React from "react";
import { makeStyles } from "@material-ui/core";
import Actions, { IActions } from "./Classroom/Actions";
import RotationControls from "./Classroom/RotationControls";
import WaitingQueue from "./Classroom/WaitingQueue";

const useStyles = makeStyles(() => ({
  root: {
    padding: ".1em",
    display: "flex",
    flexDirection: "column",
  },
  info: {
    marginBottom: ".7em",
    textAlign: "center",
  },
  idNumber: {
    color: "green",
  },
}));

export default function ClassroomAction(props: {
  info?: { id: string };
  waiting?: number;
  queue?: number;
  hasLogin?: boolean;
  onRotate: (clockwise: boolean) => void;
  actions: IActions;
}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.info}>
        <div>
          {!props.hasLogin && (
            <b>
              學號：
              <span className={classes.idNumber}>{props.info?.id || ""}</span>
            </b>
          )}
        </div>
        <WaitingQueue
          hasLogin={props.hasLogin}
          waiting={props.waiting}
          queue={props.queue}
        />
      </div>
      <Actions
        hasLogin={props.hasLogin}
        actions={props.actions}
        isInQueue={props.queue !== -1}
      />
      <RotationControls onRotate={props.onRotate} />
    </div>
  );
}
