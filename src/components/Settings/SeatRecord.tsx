import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import FirebaseService from "../../services/FirebaseService";
import { default as SeatRecordObject } from "../../entities/SeatRecord";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import SeatTableCreator from "../../services/SeatTableCreator";
import { Download } from "@mui/icons-material";

const useStyles = makeStyles(() => ({
  inputs: {
    display: "flex",
    flexDirection: "column",
    gap: "1em",
  },
}));
export default function SeatRecord() {
  const classes = useStyles();
  const [records, setRecords] = useState<SeatRecordObject[]>([]);
  const [selectedIndex, setSelectedIndex] = useState("");

  useEffect(() => {
    const getData = async () => {
      const records = await FirebaseService.Instance.getSeatRecordList();
      const data = records.docs
        .map((r) => r.data() as SeatRecordObject)
        .sort((a, b) => b.classTime.toMillis() - a.classTime.toMillis());
      setRecords(data);
    };
    getData();
  }, []);

  const download = () => {
    const index = parseInt(selectedIndex);
    const record = records[index];
    if (!record) return;
    const csv = encodeURI(SeatTableCreator.Instance.createSeatTableCSV(record));

    const a = document.createElement("a");
    a.setAttribute("href", csv);
    a.setAttribute(
      "download",
      `${record.classTime.toDate().toLocaleDateString()}.csv`
    );
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className={classes.inputs}>
      <FormControl fullWidth>
        <InputLabel id="class-select-label">課程選擇</InputLabel>
        <Select
          labelId="class-select-label"
          id="class-select"
          value={selectedIndex}
          label="課程選擇"
          onChange={(e) => setSelectedIndex(e.target.value.toString())}
        >
          {records.map((r, index) => (
            <MenuItem value={index.toString()} key={index}>
              {r.classTime.toDate().toLocaleDateString()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" onClick={() => download()}>
        下載
      </Button>
    </div>
  );
}
