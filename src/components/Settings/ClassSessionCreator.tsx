import React, { ChangeEvent, FormEvent, useState } from "react";
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { createStyles, makeStyles } from "@mui/styles";

function formatToTwoDigits(num: number): string {
  return num >= 10 ? num.toString() : `0${num}`;
}
function dateToInputDate(date: Date): string {
  return `${date.getFullYear()}-${formatToTwoDigits(
    date.getMonth() + 1
  )}-${formatToTwoDigits(date.getDate())}T${formatToTwoDigits(
    date.getHours()
  )}:${formatToTwoDigits(date.getMinutes())}`;
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: "grid",
      gridTemplateColumns: "15em 1fr",
      gap: "1em",
    },
    inputs: {
      display: "flex",
      flexDirection: "column",
      gap: "1em",
    },
  })
);
export default function ClassSessionCreator() {
  const classes = useStyles();
  const [startTime, setStartTime] = useState(
    new Date(`${new Date().toISOString().substring(0, 10)}T14:00:00`)
  );
  const [endTime, setEndTime] = useState(
    new Date(`${new Date().toISOString().substring(0, 10)}T17:00:00`)
  );
  const [amount, setAmount] = useState(2);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: save to Firebase
    console.log(startTime);
    console.log(endTime);
  };

  return (
    <div className={classes.root}>
      <form className={classes.inputs} onSubmit={submit}>
        <TextField
          required
          label="開始時間"
          type="datetime-local"
          value={dateToInputDate(startTime)}
          onChange={(date) => setStartTime(new Date(date.target.value))}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          required
          label="結束時間"
          type="datetime-local"
          value={dateToInputDate(endTime)}
          onChange={(date) => setEndTime(new Date(date.target.value))}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          required
          label="題數"
          type="number"
          value={amount}
          onChange={(amount: ChangeEvent<HTMLInputElement>) =>
            setAmount(parseInt(amount.target.value))
          }
        />
        <Button variant="contained" color="primary" type="submit">
          新增
        </Button>
      </form>
      <div>
        <Typography variant="h6" sx={{ fontSize: ".8em" }}>
          已預訂時間
        </Typography>
        <List>
          <ListItem
            disablePadding
            secondaryAction={
              <IconButton edge="end" aria-label="delete">
                <Delete />
              </IconButton>
            }
          >
            <ListItemText primary="Inbox" />
          </ListItem>
          <ListItem
            disablePadding
            secondaryAction={
              <IconButton edge="end" aria-label="delete">
                <Delete />
              </IconButton>
            }
          >
            <ListItemText primary="Inbox" />
          </ListItem>
        </List>
      </div>
    </div>
  );
}
