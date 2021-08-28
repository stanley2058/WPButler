import React from "react";
import { Door, Window, Teacher, WhiteBoard } from "../classroom-objects";
import ILayout from "../Layout";

const INS203: ILayout = {
  id: "INS203",
  name: "前教室 (203)",
  scenes: {
    top: [{ element: <Door /> }, { element: <Window /> }],
    left: [
      { element: <Door /> },
      { element: <Window /> },
      { element: <Door /> },
    ],
    right: [{ element: <Teacher /> }, { element: <WhiteBoard /> }],
    bottom: [{ element: <Window /> }],
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
