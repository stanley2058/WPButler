import React from "react";
import { Door, Window, Teacher, WhiteBoard } from "../classroom-objects";
import type ILayout from "../Layout";

const INS203_201: ILayout = {
  id: "INS203_201",
  name: "電腦教室 (203_201)",
  scenes: {
    top: [{ element: <Window />, width: "auto" }],
    left: [
      { element: <Teacher />, width: 2 },
      { element: <WhiteBoard />, width: "auto" },
    ],
    right: [{ element: <WhiteBoard />, width: "auto" }],
    bottom: [
      { element: <Door />, width: 1 },
      { element: <Window />, width: "auto" },
      { element: <Door />, width: 1 },
      { element: <Door />, width: 1 },
      { element: <Window />, width: "auto" },
      { element: <Door />, width: 1 },
    ],
  },
  seats: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
};

export default INS203_201;
