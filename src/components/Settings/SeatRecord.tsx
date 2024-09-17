import React, { useEffect, useState } from "react";
import FirebaseService from "../../services/FirebaseService";
import { SeatRecord as SeatRecordType } from "../../entities/SeatRecord";
import { Button, Select, Flex } from "@mantine/core";
import SeatTableCreator from "../../services/SeatTableCreator";

export default function SeatRecord() {
  const [records, setRecords] = useState<SeatRecordType[]>([]);
  const [selectedIndex, setSelectedIndex] = useState("");

  useEffect(() => {
    FirebaseService.Instance.getSeatRecordList().then(setRecords);
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
      `${record.classTime.toDate().toLocaleDateString()}.csv`,
    );
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Flex direction="column" gap="1rem">
      <Select
        w="100%"
        id="class-select"
        label="課程選擇"
        placeholder="選擇課程時間"
        checkIconPosition="right"
        value={selectedIndex}
        onChange={(v) => {
          if (v) setSelectedIndex(v);
        }}
        data={records.map((r, index) => ({
          label: `${r.classTime.toDate().toLocaleDateString("zh-TW")} (${r.classTime.toDate().toLocaleTimeString("zh-TW")} 開始)`,
          value: `${index}`,
        }))}
      />
      <Button color="indigo" onClick={() => download()}>
        下載
      </Button>
    </Flex>
  );
}
