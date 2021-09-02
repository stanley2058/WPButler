import React from "react";
import { Button, ButtonGroup, makeStyles } from "@material-ui/core";
import {
  Notifications,
  Help,
  LibraryBooks,
  Replay,
  Done,
  Create,
} from "@material-ui/icons";

export interface IActions {
  call: () => void;
  commonQuestions: () => void;
  thisWeekHomework: () => void;
  resetSeat: () => void;
  completeDemo: () => void;
  manualDemo: () => void;
}

const useStyles = makeStyles(() => ({
  action: {
    display: "flex",
    flexDirection: "column",
    gap: ".5em",
    placeItems: "center",
    justifyContent: "center",
  },
}));

function StudentActions(props: { actions: IActions }) {
  const classes = useStyles();
  return (
    <div className={classes.action}>
      <ButtonGroup variant="contained">
        <Button
          startIcon={<Notifications />}
          color="primary"
          onClick={props.actions.call}
        >
          呼叫助教
        </Button>
        <Button
          startIcon={<Help />}
          color="primary"
          onClick={props.actions.commonQuestions}
        >
          常見問題
        </Button>
      </ButtonGroup>
      <ButtonGroup variant="contained">
        <Button
          startIcon={<LibraryBooks />}
          color="primary"
          onClick={props.actions.thisWeekHomework}
        >
          本週作業
        </Button>
        <Button
          startIcon={<Replay />}
          color="secondary"
          onClick={props.actions.resetSeat}
        >
          重設座位
        </Button>
      </ButtonGroup>
    </div>
  );
}

function TAActions(props: { actions: IActions }) {
  const classes = useStyles();
  return (
    <div className={classes.action}>
      <ButtonGroup variant="contained">
        <Button
          startIcon={<Done />}
          color="primary"
          onClick={props.actions.completeDemo}
        >
          完成目前
        </Button>
        <Button
          startIcon={<Create />}
          color="primary"
          onClick={props.actions.manualDemo}
        >
          手動Demo
        </Button>
      </ButtonGroup>
    </div>
  );
}

export default function Actions(props: {
  hasLogin?: boolean;
  actions: IActions;
}) {
  if (props.hasLogin) return <TAActions actions={props.actions} />;
  return <StudentActions actions={props.actions} />;
}
