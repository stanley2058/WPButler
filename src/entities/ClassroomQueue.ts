import { DocumentReference, Timestamp } from "firebase/firestore";

export interface ClassroomQueue {
  queue: [
    {
      id: string;
      rotation: number;
      sitting: {
        row: number;
        col: number;
      };
      appliedAt: Timestamp;
    }
  ];
  resolved: [
    {
      id: string;
      points: number;
      resolvedAt: Timestamp;
    }
  ];
  time: DocumentReference;
}
