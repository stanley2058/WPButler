import React, { forwardRef } from "react";
import { ThemeIcon, Tooltip } from "@mantine/core";
import { IconArmchair } from "@tabler/icons-react";
import SeatSelectionService from "../../services/SeatSelectionService";

export default function Seat(props: {
  row: number;
  col: number;
  color: number;
  clickable?: boolean;
}) {
  const displayColor = props.color === 1 ? "dark" : "grape";
  const tooltipText =
    props.color === 1 ? "移動到這裡" : "移動到這裡 (橫向座位)";

  if (!props.clickable) return <ChairIcon color={displayColor} />;
  return (
    <a
      onClick={() => {
        SeatSelectionService.Instance.emitSelection(props.row, props.col);
      }}
      style={{ cursor: "pointer" }}
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
      <ThemeIcon ref={ref} color={color} variant="transparent" size="sm">
        <IconArmchair />
      </ThemeIcon>
    );
  },
);
