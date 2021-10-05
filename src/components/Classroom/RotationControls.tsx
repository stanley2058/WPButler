import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { RotateLeft, RotateRight } from "@mui/icons-material";

const useStyles = makeStyles(() => ({
  rotateControl: {
    display: "flex",
    justifyContent: "space-evenly",
    placeItems: "center",
  },
}));

export default function RotationControls(props: {
  onRotate: (clockwise: boolean) => void;
}) {
  const classes = useStyles();
  return (
    <div className={classes.rotateControl}>
      <Tooltip title="逆時針旋轉">
        <IconButton
          onClick={() => {
            props.onRotate(false);
          }}
          color="secondary"
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
          color="secondary"
          aria-label="rotate clockwise"
        >
          <RotateRight fontSize="large" />
        </IconButton>
      </Tooltip>
    </div>
  );
}
