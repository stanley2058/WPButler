import { LayoutUtils } from "../entities/Layout";
import { INS203_201 } from "../entities/layouts";
import type { SeatRecord } from "../entities/SeatRecord";
import { getTranslation } from "./I18n";

export default class SeatTableCreator {
  private static instance: SeatTableCreator;
  static get Instance(): SeatTableCreator {
    if (!SeatTableCreator.instance)
      SeatTableCreator.instance = new SeatTableCreator();
    return SeatTableCreator.instance;
  }
  private constructor() {}

  createSeatTableCSV(record: SeatRecord) {
    const i18n = getTranslation();
    const layout = INS203_201;
    const rowCount = layout.seats.length;
    const colCount = layout.seats[0]!.length;
    let mapped = record.sittingRecords.map((r) => ({
      ...r,
      rotation: 0,
      sitting: {
        ...LayoutUtils.translateLocationToStandard(
          layout,
          r.rotation,
          r.sitting.row,
          r.sitting.col,
        ),
      },
    }));

    const studentTimeMapping: Record<string, number> = {};
    mapped.forEach((r) => {
      if (studentTimeMapping[r.id] && studentTimeMapping[r.id]! > r.createAt)
        return;
      studentTimeMapping[r.id] = r.createAt;
    });
    mapped = mapped.filter((r) => r.createAt === studentTimeMapping[r.id]);

    const table: { id: string; time: number }[][] = [];
    for (let i = 0; i < rowCount; i++) table.push([]);
    mapped.forEach((r) => {
      if (
        table[r.sitting.row]![r.sitting.col] &&
        table[r.sitting.row]![r.sitting.col]!.time > r.createAt
      )
        return;
      table[r.sitting.row]![r.sitting.col] = {
        id: r.id,
        time: r.createAt,
      };
    });

    let csvData = "data:text/csv;charset=utf-8,";

    for (let j = 0; j < colCount + 2; j++) {
      csvData += i18n.t("export.up");
      if (j !== colCount + 1) csvData += ",";
    }
    csvData += "\n";

    for (let i = 0; i < rowCount; i++) {
      csvData += i18n.t("export.left");
      for (let j = 0; j < colCount + 2; j++) {
        if (j === 0 || j === colCount + 1) {
        } else {
          const id = table[i]![j - 1]?.id ?? "";
          csvData += `,${id}`;
        }
      }
      csvData += "," + i18n.t("export.right") + "\n";
    }

    for (let j = 0; j < colCount + 2; j++) {
      csvData += i18n.t("export.down");
      if (j !== colCount + 1) csvData += ",";
    }
    csvData += "\n";
    return csvData;
  }
}
