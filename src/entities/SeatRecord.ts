import { Timestamp } from "@firebase/firestore";

export interface SeatRecord {
  classTime: Timestamp;
  sittingRecords: {
    id: string;
    rotation: number;
    sitting: {
      row: number;
      col: number;
    };
    createAt: Timestamp;
  }[];
}

export interface SeatRecordFlatten {
  classTime: Timestamp;
  sittingRecords: {
    id: string;
    rotation: number;
    sittingRow: number;
    sittingCol: number;
    createAt: Timestamp;
  }[];
}
