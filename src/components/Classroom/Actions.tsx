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

const useStyles = makeStyles(() => ({
  action: {
    display: "flex",
    flexDirection: "column",
    gap: ".5em",
    placeItems: "center",
    justifyContent: "center",
  },
}));

function StudentActions() {
  const classes = useStyles();
  return (
    <div className={classes.action}>
      <ButtonGroup variant="contained">
        <Button startIcon={<Notifications />} color="primary">
          呼叫助教
        </Button>
        <Button startIcon={<Help />} color="primary">
          常見問題
        </Button>
      </ButtonGroup>
      <ButtonGroup variant="contained">
        <Button startIcon={<LibraryBooks />} color="primary">
          本週作業
        </Button>
        <Button startIcon={<Replay />} color="secondary">
          重設座位
        </Button>
      </ButtonGroup>
    </div>
  );
}

function TAActions() {
  const classes = useStyles();
  return (
    <div className={classes.action}>
      <ButtonGroup variant="contained">
        <Button startIcon={<Done />} color="primary">
          完成目前
        </Button>
        <Button startIcon={<Create />} color="primary">
          手動Demo
        </Button>
      </ButtonGroup>
    </div>
  );
}

export default function Actions(props: { hasLogin?: boolean }) {
  if (props.hasLogin) return <TAActions />;
  return <StudentActions />;
}
