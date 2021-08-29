import React from "react";
import {
  Button,
  makeStyles,
  Theme,
  Badge,
  Tooltip,
  IconButton,
  ButtonGroup,
} from "@material-ui/core";
import {
  Notifications,
  Replay,
  LibraryBooks,
  People,
  EmojiPeople,
  RotateLeft,
  RotateRight,
} from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: ".1em",
    display: "flex",
    flexDirection: "column",
  },
  info: {
    marginBottom: ".7em",
    textAlign: "center",
  },
  action: {
    display: "flex",
    placeItems: "center",
    justifyContent: "center",
  },
  icons: {
    cursor: "help",
  },
  waitingQueueRoot: {
    display: "flex",
    placeItems: "center",
    justifyContent: "center",
  },
  waitingQueue: {
    display: "flex",
    justifyContent: "space-evenly",
    maxWidth: "10em",
    width: "100%",
  },
  idNumber: {
    color: "green",
  },
  rotateControl: {
    display: "flex",
    justifyContent: "space-evenly",
    placeItems: "center",
    marginTop: "1em",
  },
}));
export default function ClassroomAction(props: {
  info?: { id: string; called: boolean };
  waiting?: number;
  queue?: number;
  onRotate: (clockwise: boolean) => void;
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
        <div className={classes.waitingQueueRoot}>
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
      </div>
      <div className={classes.action}>
        <ButtonGroup variant="contained">
          <Button startIcon={<Notifications />} color="primary">
            呼叫助教
          </Button>
          <Button startIcon={<LibraryBooks />} color="primary">
            本週作業
          </Button>
          <Button startIcon={<Replay />} color="secondary">
            重設座位
          </Button>
        </ButtonGroup>
      </div>
      <div className={classes.rotateControl}>
        <Tooltip title="逆時針旋轉">
          <IconButton
            onClick={() => {
              props.onRotate(false);
            }}
            color="primary"
            aria-label="rotate counterclockwise"
          >
            <RotateLeft fontSize="large" />
          </IconButton>
        </Tooltip>
        <span>旋轉座位顯示</span>
        <Tooltip title="順時針旋轉">
          <IconButton
            onClick={() => {
              props.onRotate(true);
            }}
            color="primary"
            aria-label="rotate clockwise"
          >
            <RotateRight fontSize="large" />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
}
