export interface ClassroomQueue {
  occupied: OccupiedItem[];
  queue: QueueItem[];
  resolved: ResolvedItem[];
}

export interface ClassroomQueueFlatten {
  occupied: OccupiedItem[];
  queue: QueueItemFlatten[];
  resolved: ResolvedItem[];
}

export interface OccupiedItem {
  studentId: string;
  taId: string;
}

export interface ResolvedItem {
  id: string;
  points: number;
  resolvedAt: number;
}

export interface QueueItem {
  id: string;
  rotation: number;
  sitting: {
    row: number;
    col: number;
  };
  appliedAt: number;
}

export interface QueueItemFlatten {
  id: string;
  rotation: number;
  sittingRow: number;
  sittingCol: number;
  appliedAt: number;
}
