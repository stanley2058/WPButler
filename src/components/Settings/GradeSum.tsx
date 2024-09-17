import React, { useEffect, useState } from "react";
import { Flex, Select, Text } from "@mantine/core";
import type ClassTime from "../../entities/ClassTime";
import FirebaseService from "../../services/FirebaseService";

export default function GradeSum() {
  const [classTimeList, setClassTimeList] = useState<
    { time: ClassTime; id: string }[]
  >([]);
  const [classId, setClassId] = useState("");
  const [studentRecords, setStudentRecords] = useState<
    { id: string; points: number }[]
  >([]);

  const getTime = async () => {
    const classTimeDocs = await FirebaseService.Instance.getAllClassTime();
    if (!classTimeDocs) return;
    setClassTimeList(classTimeDocs);
  };
  const getClassroom = async () => {
    if (!classId) return;
    const data = await FirebaseService.Instance.getClassroomQueueById(classId);
    const maxPoints =
      classTimeList.find((c) => c.id === classId)?.time.maxPoints || 0;
    const map: { [id: string]: number } = {};
    data.resolved.forEach((record) => {
      if (!map[record.id]) map[record.id] = 0;
      map[record.id]! += record.points;
      if (map[record.id]! > maxPoints) map[record.id] = maxPoints;
    });
    setStudentRecords(
      Object.keys(map)
        .map((k) => ({ id: k, points: map[k]! }))
        .filter((r) => r.points > 0)
        .sort((a, b) => a.id.localeCompare(b.id)),
    );
  };

  useEffect(() => {
    getTime();
  }, []);
  useEffect(() => {
    getClassroom();
  }, [classId]);

  return (
    <Flex direction="column" gap="1rem">
      <Select
        placeholder="選擇課程時間"
        checkIconPosition="right"
        w="100%"
        label="課程選擇"
        id="class-select"
        value={classId}
        onChange={(v) => {
          if (v) setClassId(v);
        }}
        data={classTimeList.map((classTime) => ({
          label: `${classTime.time.start.toDate().toLocaleString("zh-TW")} (開始時間)`,
          value: classTime.id,
        }))}
      />
      <Flex direction="row" gap="1rem" ta="left">
        <table>
          <thead>
            <tr>
              <th>
                <Text fw="bold" w="8rem">
                  學號
                </Text>
              </th>
              <th>
                <Text fw="bold">題數</Text>
              </th>
            </tr>
          </thead>
          <tbody>
            {studentRecords.map((record) => (
              <tr key={record.id}>
                <td>
                  <Text ff="monospace">{record.id}</Text>
                </td>
                <td>
                  <Text ff="monospace">{record.points}</Text>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Flex>
    </Flex>
  );
}
