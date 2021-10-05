import React from "react";
import { createStyles, makeStyles } from "@mui/styles";
import { Button, TextField } from "@mui/material";

const useStyles = makeStyles(() =>
  createStyles({
    inputs: {
      display: "flex",
      flexDirection: "column",
      gap: "1em",
      maxWidth: "15em",
    },
  })
);
export default function GradeSum() {
  const classes = useStyles();

  return (
    <form>
      <TextField
        required
        label="開始時間"
        type="datetime-local"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        required
        label="結束時間"
        type="datetime-local"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <Button variant="contained" color="primary" type="submit">
        統計
      </Button>
    </form>
  );
}
