import { Timestamp } from "firebase/firestore";

export default interface ClassTime {
  start: Timestamp;
  end: Timestamp;
  maxPoints: number;
  thisWeekHomeworkUrl: string;
}
