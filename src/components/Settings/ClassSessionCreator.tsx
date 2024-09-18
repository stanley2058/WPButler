import React, {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useState,
} from "react";
import FirebaseService from "../../services/FirebaseService";
import type ClassTime from "../../entities/ClassTime";
import { Swal } from "../../services/SweatAlert";
import {
  Input,
  Button,
  List,
  ThemeIcon,
  Flex,
  Text,
  ActionIcon,
  Title,
  Grid,
} from "@mantine/core";
import {
  IconClockHour2,
  IconProgressCheck,
  IconTrash,
} from "@tabler/icons-react";
import { useTranslation } from "../../services/I18n";

export default function ClassSessionCreator() {
  const i18n = useTranslation();
  const [classDate, setClassDate] = useState(new Date());
  const [startTime, setStartTime] = useState("14:00");
  const [endTime, setEndTime] = useState("17:00");
  const [amount, setAmount] = useState(2);
  const [homeworkUri, setHomeworkUri] = useState(
    "https://tronclass.ntou.edu.tw/",
  );
  const [classTimeList, setClassTimeList] = useState<
    { time: ClassTime; id: string }[]
  >([]);

  const getTime = async () => {
    const classTimeDocs = await FirebaseService.Instance.getAllClassTime();
    if (!classTimeDocs) return;
    setClassTimeList(classTimeDocs);
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const start = new Date(
      `${classDate.toISOString().split("T")[0]}T${startTime}`,
    );
    const end = new Date(`${classDate.toISOString().split("T")[0]}T${endTime}`);
    await FirebaseService.Instance.createNewClassSession(
      start,
      end,
      amount,
      homeworkUri,
    );
    await Swal.fire({
      icon: "success",
      title: i18n.t("management.class.editClass"),
      text: i18n.t("management.class.created"),
    });
    location.reload();
  };

  const deleteClass = async (id: string) => {
    const res = await Swal.fire({
      icon: "warning",
      title: i18n.t("management.class.editClass"),
      text: i18n.t("management.class.confirmDelete"),
      confirmButtonText: i18n.t("common.confirm"),
      showCancelButton: true,
      cancelButtonText: i18n.t("common.goBack"),
    });
    if (!res.isConfirmed) return;
    await FirebaseService.Instance.deleteClassSession(id);
    await Swal.fire({
      icon: "success",
      title: i18n.t("management.class.editClass"),
      text: i18n.t("management.class.deleted"),
    });
    await getTime();
  };

  useEffect(() => {
    getTime();
  }, []);

  return (
    <Grid gutter={{ base: "1rem" }}>
      <Grid.Col span={4}>
        <form
          onSubmit={submit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <Input.Wrapper label={i18n.t("management.class.date")}>
            <Input
              required
              type="date"
              value={classDate.toISOString().split("T")[0]}
              onChange={(date) => setClassDate(new Date(date.target.value))}
            />
          </Input.Wrapper>
          <Input.Wrapper label={i18n.t("management.class.startAt")}>
            <Input
              required
              type="time"
              value={startTime}
              onChange={(time) => setStartTime(time.target.value)}
            />
          </Input.Wrapper>
          <Input.Wrapper label={i18n.t("management.class.endAt")}>
            <Input
              required
              type="time"
              value={endTime}
              onChange={(time) => setEndTime(time.target.value)}
            />
          </Input.Wrapper>
          <Input.Wrapper label={i18n.t("management.class.totalPoints")}>
            <Input
              required
              type="number"
              value={amount}
              onChange={(amount: ChangeEvent<HTMLInputElement>) =>
                setAmount(parseInt(amount.target.value))
              }
            />
          </Input.Wrapper>
          <Input.Wrapper label={i18n.t("management.class.homeworkLink")}>
            <Input
              required
              type="url"
              value={homeworkUri}
              onChange={(e) => setHomeworkUri(e.target.value)}
            />
          </Input.Wrapper>
          <Button color="indigo" type="submit">
            {i18n.t("common.create")}
          </Button>
        </form>
      </Grid.Col>
      <Grid.Col span={8}>
        <div style={{ maxHeight: "27rem", overflow: "auto" }}>
          <Title
            pb="xs"
            order={6}
            pos="sticky"
            top={0}
            style={{ zIndex: 1, backgroundColor: "var(--mantine-color-body)" }}
          >
            {i18n.t("management.class.classTime")}
          </Title>
          <List
            spacing="xs"
            size="sm"
            center
            icon={
              <ThemeIcon color="blue" size={24} radius="xl">
                <IconClockHour2 />
              </ThemeIcon>
            }
          >
            {classTimeList.map((classTime) => (
              <List.Item
                key={classTime.time.start.toDate().toISOString()}
                icon={
                  classTime.time.start.toDate() > new Date() ? undefined : (
                    <ThemeIcon color="lime" size={24} radius="xl">
                      <IconProgressCheck />
                    </ThemeIcon>
                  )
                }
              >
                <Flex justify="space-between" align="center" gap="0.5rem">
                  <Text fw={500} ff="monospace">
                    {i18n.t("management.class.startAtFull", {
                      date: classTime.time.start
                        .toDate()
                        .toLocaleDateString(i18n.t("localeCode")),
                      time: classTime.time.start
                        .toDate()
                        .toLocaleTimeString(i18n.t("localeCode")),
                    })}
                  </Text>

                  {classTime.time.start.toDate() > new Date() ? (
                    <ActionIcon
                      aria-label="delete"
                      onClick={() => deleteClass(classTime.id)}
                      variant="subtle"
                      color="red"
                    >
                      <IconTrash />
                    </ActionIcon>
                  ) : null}
                </Flex>
              </List.Item>
            ))}
          </List>
        </div>
      </Grid.Col>
    </Grid>
  );
}
