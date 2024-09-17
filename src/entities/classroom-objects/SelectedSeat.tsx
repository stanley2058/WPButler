import React, { forwardRef } from "react";
import { Tooltip, ThemeIcon } from "@mantine/core";
import { IconUserPin } from "@tabler/icons-react";

export default function SelectedSeat(props: { hasLogin?: boolean }) {
  if (props.hasLogin) return <PersonPin color="indigo" />;
  return (
    <span style={{ cursor: "help" }}>
      <Tooltip label="現在的座位">
        <PersonPin color="indigo" />
      </Tooltip>
    </span>
  );
}

const PersonPin = forwardRef<HTMLDivElement, { color: string }>(
  ({ color }, ref) => {
    return (
      <ThemeIcon ref={ref} color={color} variant="transparent" size="sm">
        <IconUserPin />
      </ThemeIcon>
    );
  },
);
