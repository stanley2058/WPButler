import React, { useState } from "react";
import { Button, MantineProvider, Input, Select, Flex } from "@mantine/core";
import {
  IconArrowBackUp,
  IconBell,
  IconCheck,
  IconCircleX,
  IconHelp,
  IconNotebook,
  IconPencil,
} from "@tabler/icons-react";
import FirebaseService from "../../services/FirebaseService";
import { Swal } from "../../services/SweatAlert";
import withReactContent from "sweetalert2-react-content";
import { theme } from "../../main";

const RSwal = withReactContent(Swal);

export interface IActions {
  call: () => void;
  cancelCall: () => void;
  resetSeat: () => void;
  completeDemo: (points: number) => void;
  manualDemo: (id: string, points: number) => void;
}

export interface IData {
  thisWeekHomeworkUrl?: string;
}

function StudentActions(props: {
  isInQueue: boolean;
  actions: IActions;
  data: IData;
}) {
  return (
    <Flex direction="column" gap="0.5rem" align="center" justify="center">
      <Button.Group>
        {props.isInQueue ? (
          <Button
            leftSection={<IconCircleX />}
            color="orange"
            onClick={props.actions.cancelCall}
          >
            取消呼叫
          </Button>
        ) : (
          <Button
            leftSection={<IconBell />}
            color="indigo"
            onClick={props.actions.call}
          >
            呼叫助教
          </Button>
        )}
        <Button
          component="a"
          leftSection={<IconHelp />}
          color="blue"
          href="https://hackmd.io/@stanley2058/HJm6o4xEF"
          target="_blank"
        >
          常見問題
        </Button>
      </Button.Group>
      <Button.Group variant="contained">
        <Button
          component="a"
          leftSection={<IconNotebook />}
          color="blue"
          href={props.data.thisWeekHomeworkUrl || "/"}
          target="_blank"
        >
          本週作業
        </Button>
        <Button
          leftSection={<IconArrowBackUp />}
          color="red"
          onClick={props.actions.resetSeat}
          disabled={props.isInQueue}
        >
          重設座位
        </Button>
      </Button.Group>
    </Flex>
  );
}

function TAActions(props: { waiting?: number; actions: IActions }) {
  return (
    <Flex direction="column" gap="0.5rem" align="center" justify="center">
      <Button.Group>
        <Button
          leftSection={<IconCheck />}
          color="indigo"
          onClick={() => fireCompleteDemoDialog(props.actions)}
          disabled={!props.waiting || props.waiting === 0}
        >
          完成目前
        </Button>
        <Button
          leftSection={<IconPencil />}
          color="blue"
          onClick={() => {
            fireCompleteDemoDialog(props.actions, true);
          }}
        >
          手動Demo
        </Button>
      </Button.Group>
    </Flex>
  );
}

function DemoDialog(props: {
  manual: boolean;
  id?: string;
  maxPoints?: number;
  actions: IActions;
}) {
  const [points, setPoints] = useState(0);
  const [id, setId] = useState(props.id);
  const handleChange = (val: string | null) => {
    if (val === null) return;
    setPoints(parseInt(val));
  };
  const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setId(event.target.value);
  };

  const submitPoints = () => {
    if (props.manual) {
      if (!id) return;
      props.actions.manualDemo(id, points);
    } else {
      props.actions.completeDemo(points);
    }
    RSwal.clickConfirm();
  };

  return (
    <Flex direction="column" gap="0.5rem" align="center">
      {props.manual ? (
        <Input
          placeholder="學號"
          required
          variant="filled"
          onChange={handleIdChange}
        />
      ) : (
        <h3>學號：{props.id}</h3>
      )}
      <Select
        w="6rem"
        comboboxProps={{ zIndex: 1070 }}
        checkIconPosition="right"
        id="number-select"
        label="題數"
        value={points.toString()}
        onChange={handleChange}
        data={[
          ...Array((props.maxPoints || 0) + 1)
            .fill(0)
            .map((_, p) => `${p}`),
        ]}
      />
      <Flex direction="row" gap="2rem" mt="1rem">
        <Button color="red" onClick={() => RSwal.clickCancel()}>
          取消
        </Button>
        <Button color="indigo" onClick={submitPoints}>
          送出
        </Button>
      </Flex>
    </Flex>
  );
}

async function fireCompleteDemoDialog(
  actions: IActions,
  manual: boolean = false,
) {
  const id = FirebaseService.Instance.currentAvailableStudent?.id;
  const maxPoints = FirebaseService.Instance.currentClassTime?.maxPoints;

  const res = await RSwal.fire({
    title: manual ? "手動Demo" : "完成目前Demo",
    html: (
      <MantineProvider theme={theme}>
        <DemoDialog
          manual={manual}
          id={id}
          maxPoints={maxPoints}
          actions={actions}
        />
      </MantineProvider>
    ),
    showConfirmButton: false,
  });
  if (res.isConfirmed)
    await RSwal.fire({
      title: "成功送出",
      icon: "success",
    });
}

export default function Actions(props: {
  hasLogin?: boolean;
  waiting?: number;
  isInQueue: boolean;
  actions: IActions;
  data: IData;
}) {
  if (props.hasLogin) {
    return <TAActions waiting={props.waiting} actions={props.actions} />;
  }
  return (
    <StudentActions
      isInQueue={props.isInQueue}
      actions={props.actions}
      data={props.data}
    />
  );
}
