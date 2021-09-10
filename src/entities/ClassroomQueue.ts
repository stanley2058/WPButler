import { Timestamp } from "firebase/firestore";

export interface ClassroomQueue {
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
