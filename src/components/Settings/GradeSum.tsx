import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import ClassTime from "../../entities/ClassTime";
import FirebaseService from "../../services/FirebaseService";
import { ClassroomQueue } from "../../entities/ClassroomQueue";

const useStyles = makeStyles(() => ({
  inputs: {
    display: "flex",
    flexDirection: "column",
    gap: "1em",
    maxWidth: "15em",
  },
  table: {
    display: "flex",
    flexDirection: "row",
    gap: "1em",
    fontFamily: "monospace",
    fontSize: "1.15em",
    textAlign: "left",
  },
  id: {
    width: "8em",
  },
}));
export default function GradeSum() {
  const classes = useStyles();

  const [classTimeList, setClassTimeList] = useState<
    { time: ClassTime; id: string }[]
  >([]);
  const [classId, setClassId] = useState("");
  const [studentRecords, setStudentRecords] = useState<
    { id: string; points: number }[]
  >([]);

  const getTime = async () => {
    const classTimeDocs = await FirebaseService.Instance.getAllClassTime();
    if (classTimeDocs.empty) return;
    setClassTimeList(
      classTimeDocs.docs
        .filter(
          (doc) => (doc.data() as ClassTime).start.toMillis() < Date.now()
        )
        .map((doc) => ({ time: doc.data() as ClassTime, id: doc.id }))
        .sort((a, b) => b.time.start.toMillis() - a.time.start.toMillis())
    );
  };
  const getClassroom = async () => {
    if (!classId) return;
    const res = await FirebaseService.Instance.getClassroomQueueById(classId);
    const maxPoints =
      classTimeList.find((c) => c.id === classId)?.time.maxPoints || 0;
    const map: { [id: string]: number } = {};
    (res.data() as ClassroomQueue).resolved.forEach((record) => {
      if (!map[record.id]) map[record.id] = 0;
      map[record.id] += record.points;
      if (map[record.id] > maxPoints) map[record.id] = maxPoints;
    });
    setStudentRecords(Object.keys(map).map((k) => ({ id: k, points: map[k] })));
  };

  useEffect(() => {
    getTime();
  }, []);
  useEffect(() => {
    getClassroom();
  }, [classId]);

  return (
    <div className={classes.inputs}>
      <FormControl fullWidth>
        <InputLabel id="class-select-label">課程選擇</InputLabel>
        <Select
          labelId="class-select-label"
          id="class-select"
          value={classId}
          label="課程選擇"
          onChange={(e) => setClassId(e.target.value)}
        >
          {classTimeList.map((classTime) => (
            <MenuItem value={classTime.id} key={classTime.id}>
              {classTime.time.start.toDate().toLocaleDateString()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className={classes.table}>
        <table>
          <thead>
            <tr>
              <th className={classes.id}>學號</th>
              <th>題數</th>
            </tr>
          </thead>
          <tbody>
            {studentRecords.map((record) => (
              <tr key={record.id}>
                <td>{record.id}</td>
                <td>{record.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
