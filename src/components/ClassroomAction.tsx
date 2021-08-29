import React from "react";
import { Button, makeStyles, Theme, Badge, Tooltip } from "@material-ui/core";
import {
  Notifications,
  Replay,
  LibraryBooks,
  People,
  EmojiPeople,
} from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: ".5em",
    display: "flex",
    flexDirection: "column",
  },
  info: {
    marginBottom: ".7em",
    textAlign: "center",
  },
  action: {
    display: "flex",
    justifyContent: "space-evenly",
  },
  icons: {
    cursor: "help",
  },
  waitingQueue: {
    display: "flex",
    justifyContent: "space-evenly",
    paddingLeft: "10em",
    paddingRight: "10em",
  },
  idNumber: {
    color: "green",
  },
}));
export default function ClassroomAction(props: {
  info?: { id: string; called: boolean };
  waiting?: number;
  queue?: number;
}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.info}>
        <div>
          <b>
            學號：
            <span className={classes.idNumber}>{props.info?.id || ""}</span>
          </b>
        </div>
        <div className={classes.waitingQueue}>
          <Tooltip title="你的順位">
            <Badge
              color="secondary"
              badgeContent={props.queue || 0}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              overlap="circular"
              showZero
            >
              <EmojiPeople
                fontSize="large"
                color="primary"
                className={classes.icons}
              />
            </Badge>
          </Tooltip>
          <Tooltip title="目前等待人數">
            <Badge
              color="secondary"
              badgeContent={props.waiting || 0}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              overlap="circular"
              showZero
            >
              <People
                fontSize="large"
                color="primary"
                className={classes.icons}
              />
            </Badge>
          </Tooltip>
        </div>
      </div>
      <div className={classes.action}>
        <Button
          startIcon={<Notifications />}
          variant="contained"
          color="primary"
        >
          呼叫助教
        </Button>
        <Button
          startIcon={<LibraryBooks />}
          variant="contained"
          color="primary"
        >
          本週作業
        </Button>
        <Button startIcon={<Replay />} variant="contained" color="secondary">
          重設座位
        </Button>
      </div>
    </div>
  );
}
