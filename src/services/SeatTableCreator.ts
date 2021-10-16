import { LayoutUtils } from "../entities/Layout";
import { INS203_201 } from "../entities/layouts";
import SeatRecord from "../entities/SeatRecord";

export default class SeatTableCreator {
  private static instance: SeatTableCreator;
  static get Instance(): SeatTableCreator {
    if (!SeatTableCreator.instance)
      SeatTableCreator.instance = new SeatTableCreator();
    return SeatTableCreator.instance;
  }
  private constructor() {}

  createSeatTableCSV(record: SeatRecord) {
    const layout = INS203_201;
    const rowCount = layout.seats.length;
    const colCount = layout.seats[0].length;
    let mapped = record.sittingRecords.map((r) => ({
      ...r,
      rotation: 0,
      sitting: {
        ...LayoutUtils.translateLocationToStandard(
          layout,
          r.rotation,
          r.sitting.row,
          r.sitting.col
        ),
      },
    }));

    const studentTimeMapping: any = {};
    mapped.forEach((r) => {
      if (
        studentTimeMapping[r.id] &&
        studentTimeMapping[r.id] > r.createAt.toMillis()
      )
        return;
      studentTimeMapping[r.id] = r.createAt.toMillis();
    });
    mapped = mapped.filter(
      (r) => r.createAt.toMillis() === studentTimeMapping[r.id]
    );

    const table: { id: string; time: number }[][] = [];
    for (let i = 0; i < rowCount; i++) table.push([]);
    mapped.forEach((r) => {
      if (
        table[r.sitting.row][r.sitting.col] &&
        table[r.sitting.row][r.sitting.col].time > r.createAt.toMillis()
      )
        return;
      table[r.sitting.row][r.sitting.col] = {
        id: r.id,
        time: r.createAt.toMillis(),
      };
    });

    let csvData = "data:text/csv;charset=utf-8,";

    for (let j = 0; j < colCount + 2; j++) {
      csvData += "上面";
      if (j !== colCount + 1) csvData += ",";
    }
    csvData += "\n";

    for (let i = 0; i < rowCount; i++) {
      csvData += "左邊";
      for (let j = 0; j < colCount + 2; j++) {
        if (j === 0 || j === colCount + 1) {
        } else {
          const id = table[i][j - 1]?.id ?? "";
          csvData += `,${id}`;
        }
      }
      csvData += ",右邊\n";
    }

    for (let j = 0; j < colCount + 2; j++) {
      csvData += "下面";
      if (j !== colCount + 1) csvData += ",";
    }
    csvData += "\n";
    console.log(csvData);
    return csvData;
  }
}
