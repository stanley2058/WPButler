import React, { useEffect, useState } from "react";
import { Button, Select, Flex } from "@mantine/core";
import FirebaseService from "../../services/FirebaseService";
import SeatTableCreator from "../../services/SeatTableCreator";
import type { SeatRecord as SeatRecordType } from "../../entities/SeatRecord";
import { useTranslation } from "../../services/I18n";

export default function SeatRecord() {
  const i18n = useTranslation();
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
      `${record.classTime.toDate().toISOString()}.csv`,
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
        label={i18n.t("management.class.selectClass")}
        placeholder={i18n.t("management.class.selectClassTime")}
        checkIconPosition="right"
        value={selectedIndex}
        onChange={(v) => {
          if (v) setSelectedIndex(v);
        }}
        data={records.map((r, index) => ({
          label: i18n.t("management.class.startAtFull", {
            date: r.classTime.toDate().toLocaleDateString(i18n.t("localeCode")),
            time: r.classTime.toDate().toLocaleTimeString(i18n.t("localeCode")),
          }),
          value: `${index}`,
        }))}
      />
      <Button color="indigo" onClick={() => download()}>
        {i18n.t("export.download")}
      </Button>
    </Flex>
  );
}
