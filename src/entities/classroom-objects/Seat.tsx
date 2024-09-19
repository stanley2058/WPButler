import React, { forwardRef } from "react";
import { ThemeIcon, Tooltip } from "@mantine/core";
import { IconArmchair } from "@tabler/icons-react";
import SeatSelectionService from "../../services/SeatSelectionService";
import { useTranslation } from "../../services/I18n";

export default function Seat(props: {
  row: number;
  col: number;
  color: number;
  clickable?: boolean;
}) {
  const i18n = useTranslation();
  const displayColor = props.color === 1 ? "gray" : "grape";
  const tooltipText =
    props.color === 1
      ? i18n.t("entity.seat.moveHere")
      : i18n.t("entity.seat.moveHereSideway");

  if (!props.clickable) return <ChairIcon color={displayColor} />;
  return (
    <a
      onClick={() => {
        SeatSelectionService.Instance.emitSelection(props.row, props.col);
      }}
      style={{ cursor: "pointer", display: "flex", height: "fit-content" }}
    >
      <Tooltip label={tooltipText}>
        <ChairIcon color={displayColor} />
      </Tooltip>
    </a>
  );
}

const ChairIcon = forwardRef<HTMLDivElement, { color: string }>(
  ({ color }, ref) => {
    return (
      <ThemeIcon ref={ref} color={color} variant="transparent" size="md">
        <IconArmchair />
      </ThemeIcon>
    );
  },
);
