export default class SeatSelectionService {
  private static instance: SeatSelectionService;
  static get Instance(): SeatSelectionService {
    if (!SeatSelectionService.instance)
      SeatSelectionService.instance = new SeatSelectionService();
    return SeatSelectionService.instance;
  }
  private constructor() {}

  private listeners: {
    id: string;
    callback: (row: number, col: number) => void;
  }[] = [];

  register(id: string, callback: (row: number, col: number) => void) {
    SeatSelectionService.Instance.listeners.push({
      id,
      callback,
    });
  }

  unregister(id: string) {
    SeatSelectionService.Instance.listeners =
      SeatSelectionService.Instance.listeners.filter((l) => l.id !== id);
  }

  emitSelection(row: number, col: number) {
    SeatSelectionService.Instance.listeners.forEach((l) =>
      l.callback(row, col),
    );
  }
}
