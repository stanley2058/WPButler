import React from "react";
import { Door, Window, Teacher, WhiteBoard } from "../classroom-objects";
import ILayout from "../Layout";

const INS203: ILayout = {
  id: "INS203",
  name: "前教室 (203)",
  scenes: {
    top: [
      { element: <Door />, width: 1 },
      { element: <Window />, width: "auto" },
    ],
    left: [
      { element: <Door />, width: 1 },
      { element: <Window />, width: "auto" },
      { element: <Door />, width: 1 },
    ],
    right: [
      { element: <Teacher />, width: 2 },
      { element: <WhiteBoard />, width: "auto" },
    ],
    bottom: [{ element: <Window />, width: "auto" }],
  },
  seats: [
    [0, 0, 1, 1, 1, 1],
    [0, 0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
  ],
};

export default INS203;
