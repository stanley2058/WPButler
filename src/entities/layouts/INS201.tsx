import React from "react";
import { Door, WhiteBoard, Window } from "../classroom-objects";
import ILayout from "../Layout";

const INS201: ILayout = {
  id: "INS201",
  name: "後教室 (201)",
  scenes: {
    top: [
      { element: <Door />, width: 1 },
      { element: <Window />, width: true },
      { element: <Door />, width: 1 },
    ],
    left: [{ element: <WhiteBoard />, width: true }],
    right: [
      { element: <Door />, width: 1 },
      { element: <Window />, width: true },
      { element: <Door />, width: 1 },
    ],
    bottom: [{ element: <Window />, width: true }],
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
