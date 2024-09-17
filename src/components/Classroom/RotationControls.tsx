import React from "react";
import { ActionIcon, Flex, Tooltip } from "@mantine/core";
import { IconRotateClockwise2 } from "@tabler/icons-react";

export default function RotationControls(props: {
  onRotate: (clockwise: boolean) => void;
}) {
  return (
    <Flex justify="space-evenly" p="0.5rem" align="center">
      <Tooltip label="逆時針旋轉">
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
      <span>旋轉座位顯示</span>
      <Tooltip label="順時針旋轉">
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
