import React, { forwardRef } from "react";
import { Tooltip, ThemeIcon } from "@mantine/core";
import { IconUserPin } from "@tabler/icons-react";
import { useTranslation } from "../../services/I18n";

export default function SelectedSeat(props: { hasLogin?: boolean }) {
  const i18n = useTranslation();
  if (props.hasLogin) return <PersonPin color="indigo" />;
  return (
    <span style={{ cursor: "help", display: "flex" }}>
      <Tooltip label={i18n.t("entity.seat.selected")}>
        <PersonPin color="indigo" />
      </Tooltip>
    </span>
  );
}

const PersonPin = forwardRef<HTMLDivElement, { color: string }>(
  ({ color }, ref) => {
    return (
      <ThemeIcon ref={ref} color={color} variant="light" radius="xl" size="md">
        <IconUserPin />
      </ThemeIcon>
    );
  },
);
