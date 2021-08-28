import React from "react";
import { LayoutUtils } from "../entities/Layout";
import { INS203 } from "../entities/layouts";

export default function Classroom() {
  console.log(INS203);
  console.log(LayoutUtils.rotateClockwise(INS203));

  return <div>Classroom</div>;
}
