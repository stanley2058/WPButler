import React, { useState, type ChangeEvent } from "react";
import { Flex, Modal, Text, Input, Button } from "@mantine/core";
import { Swal } from "../services/SweatAlert";
import ClassroomUtils from "../services/ClassroomUtils";
import { useTranslation } from "../services/I18n";

export default function SeatGuideDialog(props: {
  open: boolean;
  onClose: (id: string, rotation: number) => void;
}) {
  const i18n = useTranslation();
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
      title: i18n.t("classroom.guide.chooseSeatTitle"),
      text: i18n.t("classroom.guide.chooseSeatDescription"),
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
      title={i18n.t("classroom.guide.quickSetting.title")}
      withCloseButton={false}
      centered
    >
      <Flex direction="column" gap="1rem">
        <Input
          w="100%"
          required
          placeholder={i18n.t("classroom.studentNumberRaw")}
          onChange={onIdChange}
        />
        <Text ta="center">
          {i18n.t("classroom.guide.quickSetting.mainQuestion")}
        </Text>
        <Button.Group w="100%">
          <Button
            w="50%"
            variant={getVariant(true)}
            color={getColor(true)}
            onClick={() => {
              chooseTeacherPosition(true);
            }}
          >
            {i18n.t("classroom.guide.quickSetting.left")}
          </Button>
          <Button
            w="50%"
            variant={getVariant(false)}
            color={getColor(false)}
            onClick={() => {
              chooseTeacherPosition(false);
            }}
          >
            {i18n.t("classroom.guide.quickSetting.right")}
          </Button>
        </Button.Group>
        <Flex justify="center">
          <Button
            disabled={!state.canComplete}
            color="indigo"
            onClick={onClose}
          >
            {i18n.t("common.done")}
          </Button>
        </Flex>
      </Flex>
    </Modal>
  );
}
