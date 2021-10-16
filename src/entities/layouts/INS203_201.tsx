import React from "react";
import { Door, Window, Teacher, WhiteBoard } from "../classroom-objects";
import ILayout from "../Layout";

const INS203_201: ILayout = {
  id: "INS203_201",
  name: "電腦教室 (203_201)",
  scenes: {
    top: [{ element: <Window />, width: true }],
    left: [
      { element: <Teacher />, width: 2 },
      { element: <WhiteBoard />, width: true },
    ],
    right: [{ element: <WhiteBoard />, width: true }],
    bottom: [
      { element: <Door />, width: 1 },
      { element: <Window />, width: true },
      { element: <Door />, width: 1 },
      { element: <Door />, width: 1 },
      { element: <Window />, width: true },
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
