import React from "react";
import { makeStyles, Tooltip, Badge } from "@material-ui/core";
import { EmojiPeople, People } from "@material-ui/icons";

const useStyles = makeStyles(() => ({
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
}));

export default function WaitingQueue(props: {
  hasLogin?: boolean;
  queue?: number;
  waiting?: number;
}) {
  const classes = useStyles();
  return (
    <div className={classes.waitingQueueRoot}>
      <div className={classes.waitingQueue}>
        {!props.hasLogin && (
          <Tooltip title="目前順位">
            <Badge
              color="secondary"
              badgeContent={props.queue || 0}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              overlap="circular"
            >
              <EmojiPeople
                fontSize="large"
                color="primary"
                className={classes.icons}
              />
            </Badge>
          </Tooltip>
        )}
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
  );
}
