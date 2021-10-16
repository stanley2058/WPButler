import { Timestamp } from "@firebase/firestore";

export default interface SeatRecord {
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
