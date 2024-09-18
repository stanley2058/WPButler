import React from "react";
import { ActionIcon, Flex, Tooltip } from "@mantine/core";
import { IconRotateClockwise2 } from "@tabler/icons-react";
import { useTranslation } from "../../services/I18n";

export default function RotationControls(props: {
  onRotate: (clockwise: boolean) => void;
}) {
  const i18n = useTranslation();
  return (
    <Flex justify="space-evenly" p="0.5rem" align="center">
      <Tooltip label={i18n.t("classroom.rotation.turnCounterClockwise")}>
        <ActionIcon
          onClick={() => {
            props.onRotate(false);
          }}
          color="blue"
          aria-label="rotate counterclockwise"
          size="lg"
          style={{ transform: "scaleX(-1)" }}
          variant="subtle"
        >
          <IconRotateClockwise2 />
        </ActionIcon>
      </Tooltip>
      <span>{i18n.t("classroom.rotation.rotateSeat")}</span>
      <Tooltip label={i18n.t("classroom.rotation.turnClockwise")}>
        <ActionIcon
          onClick={() => {
            props.onRotate(true);
          }}
          color="blue"
          aria-label="rotate clockwise"
          size="lg"
          variant="subtle"
        >
          <IconRotateClockwise2 />
        </ActionIcon>
      </Tooltip>
    </Flex>
  );
}
