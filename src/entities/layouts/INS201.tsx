import React from "react";
import { Door, WhiteBoard, Window } from "../classroom-objects";
import type ILayout from "../Layout";

const INS201: ILayout = {
  id: "INS201",
  name: "後教室 (201)",
  scenes: {
    top: [
      { element: <Door />, width: 1 },
      { element: <Window />, width: "auto" },
      { element: <Door />, width: 1 },
    ],
    left: [{ element: <WhiteBoard />, width: "auto" }],
    right: [
      { element: <Door />, width: 1 },
      { element: <Window />, width: "auto" },
      { element: <Door />, width: 1 },
    ],
    bottom: [{ element: <Window />, width: "auto" }],
  },
  seats: [
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
  ],
};

export default INS201;
