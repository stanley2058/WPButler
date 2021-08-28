import React from "react";
import { Door, WhiteBoard, Window } from "../classroom-objects";
import ILayout from "../Layout";

const INS201: ILayout = {
  id: "INS201",
  name: "後教室 (201)",
  scenes: {
    top: [
      { element: <Door /> },
      { element: <Window /> },
      { element: <Door /> },
    ],
    left: [{ element: <WhiteBoard /> }],
    right: [
      { element: <Door /> },
      { element: <Window /> },
      { element: <Door /> },
    ],
    bottom: [{ element: <Window /> }],
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
