import { Timestamp } from "firebase/firestore";

export interface ClassroomQueue {
  occupied: [
    {
      studentId: string;
      taId: string;
    }
  ];
  queue: QueueItem[];
  resolved: [
    {
      id: string;
      points: number;
      resolvedAt: Timestamp;
    }
  ];
}

export interface QueueItem {
  id: string;
  rotation: number;
  sitting: {
    row: number;
    col: number;
  };
  appliedAt: Timestamp;
}
