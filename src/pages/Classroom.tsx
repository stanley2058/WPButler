import React, { useState } from "react";
import ClassroomLayout from "../components/ClassroomLayout";
import ILayout from "../entities/Layout";
import { INS203 } from "../entities/layouts";
import SeatSelectionService from "../services/SeatSelectionService";

export default function Classroom() {
  const [state, setState] = useState<{
    layout: ILayout;
    sitting?: { row: number; col: number };
  }>({
    layout: INS203,
  });

  SeatSelectionService.Instance.register(
    "classroom-selection-listener",
    (row: number, col: number) => {
      setState({ ...state, sitting: { row, col } });
    }
  );

  return (
    <div>
      <ClassroomLayout layout={state.layout} sitting={state.sitting} />
    </div>
  );
}
