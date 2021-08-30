import React from "react";
import { Door, Window, Teacher, WhiteBoard } from "../classroom-objects";
import ILayout from "../Layout";

const INS203_201: ILayout = {
  id: "INS203_201",
  name: "電腦教室 (203_201)",
  scenes: {
    top: [
      { element: <Door />, width: 1 },
      { element: <Window />, width: true },
      { element: <Door />, width: 1 },
      { element: <Door />, width: 1 },
      { element: <Window />, width: true },
    ],
    left: [{ element: <WhiteBoard />, width: true }],
    right: [
      { element: <Teacher />, width: 2 },
      { element: <WhiteBoard />, width: true },
    ],
    bottom: [{ element: <Window />, width: true }],
  },
  seats: [
    [1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
};

export default INS203_201;
