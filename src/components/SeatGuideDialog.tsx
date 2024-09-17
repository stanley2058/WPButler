import React, { useState, type ChangeEvent } from "react";
import { Flex, Modal, Text, Input, Button } from "@mantine/core";
import Swal from "sweetalert2";
import ClassroomUtils from "../services/ClassroomUtils";

export default function SeatGuideDialog(props: {
  open: boolean;
  onClose: (id: string, rotation: number) => void;
}) {
  const [state, setState] = useState<{
    isLeft?: boolean;
    isOpen: boolean;
    canComplete: boolean;
    id?: string;
  }>({
    isOpen: props.open,
    canComplete: false,
  });

  ClassroomUtils.onGuideDialogOpenStateChange((open) => {
    if (open)
      setState({
        isOpen: open,
        canComplete: false,
      });
    else setState({ ...state, isOpen: open });
  });

  const onClose = async () => {
    if (!state.id) return;
    setState({ ...state, isOpen: false });
    await Swal.fire({
      icon: "info",
      title: "選擇座位",
      text: "點選教室平面圖上面的座位來設定目前的位子。",
    });
    props.onClose(state.id, state.isLeft ? 0 : 2);
  };
  const chooseTeacherPosition = (isLeft: boolean) => {
    setState({
      ...state,
      isLeft,
      canComplete: !!state.id,
    });
  };
  const getVariant = (isLeft: boolean) => {
    if (state.isLeft === isLeft) return "filled";
    return "outline";
  };
  const getColor = (isLeft: boolean) => {
    if (state.isLeft === isLeft) return undefined;
    return "blue";
  };
  const onIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    const id = event.target.value.trim();
    setState({ ...state, id, canComplete: !!id && state.isLeft !== undefined });
  };

  return (
    <Modal
      opened={state.isOpen}
      onClose={onClose}
      title="快速設定"
      withCloseButton={false}
      centered
    >
      <Flex direction="column" gap="1rem">
        <Input w="100%" required placeholder="學號" onChange={onIdChange} />
        <Text ta="center">電腦在我的前面的話，老師坐在我的...？</Text>
        <Button.Group w="100%">
          <Button
            w="50%"
            variant={getVariant(true)}
            color={getColor(true)}
            onClick={() => {
              chooseTeacherPosition(true);
            }}
          >
            左邊
          </Button>
          <Button
            w="50%"
            variant={getVariant(false)}
            color={getColor(false)}
            onClick={() => {
              chooseTeacherPosition(false);
            }}
          >
            右邊
          </Button>
        </Button.Group>
        <Flex justify="center">
          <Button
            disabled={!state.canComplete}
            color="indigo"
            onClick={onClose}
          >
            完成
          </Button>
        </Flex>
      </Flex>
    </Modal>
  );
}
