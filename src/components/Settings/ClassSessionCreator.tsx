import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
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
import { makeStyles } from "@mui/styles";
import FirebaseService from "../../services/FirebaseService";
import ClassTime from "../../entities/ClassTime";
import Swal from "sweetalert2";

const useStyles = makeStyles(() => ({
  root: {
    display: "grid",
    gridTemplateColumns: "10.5em 1fr",
    gap: "1em",
  },
  inputs: {
    display: "flex",
    flexDirection: "column",
    gap: "1em",
  },
}));
export default function ClassSessionCreator() {
  const classes = useStyles();
  const [classDate, setClassDate] = useState(new Date());
  const [startTime, setStartTime] = useState("14:00");
  const [endTime, setEndTime] = useState("17:00");
  const [amount, setAmount] = useState(2);
  const [classTimeList, setClassTimeList] = useState<
    { time: ClassTime; id: string }[]
  >([]);

  const getTime = async () => {
    const classTimeDocs = await FirebaseService.Instance.getAllClassTime();
    if (classTimeDocs.empty) return;
    setClassTimeList(
      classTimeDocs.docs
        .map((doc) => ({ time: doc.data() as ClassTime, id: doc.id }))
        .sort((a, b) => b.time.start.toMillis() - a.time.start.toMillis())
    );
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const start = new Date(
      `${classDate.toISOString().split("T")[0]}T${startTime}`
    );
    const end = new Date(`${classDate.toISOString().split("T")[0]}T${endTime}`);
    await FirebaseService.Instance.createNewClassSession(start, end, amount);
    await Swal.fire({
      icon: "success",
      title: "課程編輯",
      text: "課程建立成功！",
    });
    await getTime();
  };

  const deleteClass = async (id: string) => {
    const res = await Swal.fire({
      icon: "warning",
      title: "課程編輯",
      text: "確認要刪除課程？此動作無法復原！",
      confirmButtonText: "確定",
      showCancelButton: true,
      cancelButtonText: "返回",
    });
    if (!res.isConfirmed) return;
    await FirebaseService.Instance.deleteClassSession(id);
    await Swal.fire({
      icon: "success",
      title: "課程編輯",
      text: "已刪除課程。",
    });
    await getTime();
  };

  useEffect(() => {
    getTime();
  }, []);

  return (
    <div className={classes.root}>
      <form className={classes.inputs} onSubmit={submit}>
        <TextField
          required
          label="日期"
          type="date"
          value={classDate.toISOString().split("T")[0]}
          onChange={(date) => setClassDate(new Date(date.target.value))}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          required
          label="開始時間"
          type="time"
          value={startTime}
          onChange={(time) => setStartTime(time.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          required
          label="結束時間"
          type="time"
          value={endTime}
          onChange={(time) => setEndTime(time.target.value)}
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
        <Typography variant="h6" sx={{ fontSize: ".9em" }}>
          已預訂時間
        </Typography>
        <List>
          {classTimeList.map((classTime) => (
            <ListItem
              key={classTime.time.start.toDate().toLocaleDateString()}
              disablePadding
              secondaryAction={
                classTime.time.start.toDate() > new Date() ? (
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => deleteClass(classTime.id)}
                  >
                    <Delete />
                  </IconButton>
                ) : null
              }
            >
              <ListItemText
                primary={classTime.time.start
                  .toDate()
                  .toLocaleDateString("zh-TW")}
              />
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
}
