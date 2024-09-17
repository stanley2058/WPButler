import { initializeApp } from "firebase/app";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
  Timestamp,
  Unsubscribe as FirestoreUnsubscribe,
  updateDoc,
  where,
  FieldValue,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
  Unsubscribe as AuthUnsubscribe,
  updatePassword,
} from "firebase/auth";
import Config from "../../Config";
import ClassTime from "../entities/ClassTime";
import {
  ClassroomQueue,
  ClassroomQueueFlatten,
  QueueItem,
  QueueItemFlatten,
} from "../entities/ClassroomQueue";
import { SeatRecord, SeatRecordFlatten } from "../entities/SeatRecord";

export default class FirebaseService {
  private static instance: FirebaseService;
  static get Instance() {
    if (!FirebaseService.instance)
      FirebaseService.instance = new FirebaseService();
    return FirebaseService.instance;
  }
  private constructor() {
    initializeApp(Config.firebaseConfig);
    this.auth = getAuth();
    this.db = getFirestore();
    this.queryDatabase();
    this.startTimer();
    this.listenSnapshots();
  }
  private auth;
  private db;

  private previousSessionState?: boolean = undefined;
  private classTime?: { id: string; data: ClassTime } | null;
  private classTimeChangedListeners: ((
    isSessionAlive: boolean,
    classTime?: ClassTime,
  ) => void)[] = [];
  private currentQueue?: ClassroomQueueFlatten;

  private flattenQueue(queue: QueueItem[]): QueueItemFlatten[] {
    return queue.map(({ sitting, ...rest }) => ({
      sittingCol: sitting.col,
      sittingRow: sitting.row,
      ...rest,
    }));
  }
  private flattenAll({
    queue,
    ...rest
  }: ClassroomQueue): ClassroomQueueFlatten {
    return { queue: this.flattenQueue(queue), ...rest };
  }
  private rebuildQueue(queue: QueueItemFlatten[]): QueueItem[] {
    return queue.map(({ sittingCol, sittingRow, ...rest }) => ({
      sitting: { col: sittingCol, row: sittingRow },
      ...rest,
    }));
  }
  private rebuildAll({
    queue,
    ...rest
  }: ClassroomQueueFlatten): ClassroomQueue {
    return { queue: this.rebuildQueue(queue), ...rest };
  }

  private async queryDatabase() {
    const classTimeQ = query(
      collection(this.db, "class-time"),
      where("end", ">=", Timestamp.now()),
    );
    const classTimeQR = await getDocs(classTimeQ);

    classTimeQR.forEach((doc) => {
      const data = doc.data() as ClassTime;
      if (data.start.toMillis() <= Timestamp.now().toMillis()) {
        FirebaseService.Instance.classTime = { id: doc.id, data };
      }
    });
    if (!FirebaseService.Instance.classTime)
      FirebaseService.Instance.classTime = null;
  }

  private async startTimer() {
    setInterval(() => {
      const currentSessionState = FirebaseService.Instance.isClassTimeValid();
      if (
        FirebaseService.Instance.previousSessionState !== currentSessionState
      ) {
        FirebaseService.Instance.previousSessionState = currentSessionState;
        FirebaseService.Instance.classTimeChangedListeners.forEach((e) =>
          e(currentSessionState, FirebaseService.Instance.classTime?.data),
        );
      }
    }, 1000);
  }

  private async listenSnapshots() {
    await this.isDataReady();
    if (FirebaseService.Instance.classTime) {
      onSnapshot(
        doc(
          FirebaseService.Instance.db,
          "class-time",
          FirebaseService.Instance.classTime.id,
        ),
        (doc) => {
          if (FirebaseService.Instance.classTime)
            FirebaseService.Instance.classTime.data = doc.data() as ClassTime;
        },
      );
    }
    FirebaseService.Instance.onClassroomQueueChanged((classroomQueue) => {
      FirebaseService.Instance.currentQueue = classroomQueue
        ? this.flattenAll(classroomQueue)
        : undefined;
      if (classroomQueue) {
        const taId = FirebaseService.Instance.currentUser?.uid;
        if (!taId) return;
        const myStudent = classroomQueue.occupied.find((s) => s.taId === taId);
        if (!myStudent) return;
        const occupied = classroomQueue.occupied.filter(
          (s) => s.studentId === myStudent.studentId,
        );
        occupied.sort((a, b) => a.taId.localeCompare(b.taId));
        if (occupied.length > 1 && occupied[0].taId !== taId) {
          FirebaseService.Instance.release(myStudent.studentId);
        }
      }
    });
  }

  private isClassTimeValid(): boolean {
    if (!FirebaseService.Instance.classTime) return false;
    let start = FirebaseService.Instance.classTime.data.start;
    return (
      start.toMillis() <= Timestamp.now().toMillis() &&
      FirebaseService.Instance.classTime.data.end.toMillis() >=
        Timestamp.now().toMillis()
    );
  }

  private get currentClassroomQueueRef(): DocumentReference<DocumentData> | null {
    if (!FirebaseService.Instance.classTime) return null;
    return doc(
      FirebaseService.Instance.db,
      "classroom-queue",
      FirebaseService.Instance.classTime.id,
    );
  }

  isDataReady(): Promise<void> {
    return new Promise<void>((res) => {
      const timer = setInterval(() => {
        if (FirebaseService.Instance.classTime !== undefined) {
          clearInterval(timer);
          FirebaseService.Instance.previousSessionState =
            FirebaseService.Instance.isClassTimeValid();
          res();
        }
      }, 10);
    });
  }

  async createAccount(
    email: string,
    password: string = "soselab401",
  ): Promise<void> {
    await createUserWithEmailAndPassword(
      FirebaseService.Instance.auth,
      email,
      password,
    );
  }

  async signIn(email: string, password: string): Promise<User | null> {
    if (FirebaseService.Instance.currentUser)
      return FirebaseService.Instance.currentUser;
    try {
      await signInWithEmailAndPassword(
        FirebaseService.Instance.auth,
        email,
        password,
      );
    } catch (error) {
      console.error(error);
    }
    return FirebaseService.Instance.currentUser;
  }

  signOut(): Promise<void> {
    return FirebaseService.Instance.auth.signOut();
  }

  async changePassword(newPasswd: string): Promise<void> {
    if (!FirebaseService.Instance.currentUser) return;
    await updatePassword(FirebaseService.Instance.currentUser, newPasswd);
  }

  get currentUser(): User | null {
    return FirebaseService.Instance.auth.currentUser;
  }

  get hasLogin(): Promise<boolean> {
    return new Promise<boolean>((res) =>
      FirebaseService.Instance.auth.onAuthStateChanged((user) => res(!!user)),
    );
  }

  get currentWaitingQueue(): ClassroomQueue | null {
    const current = FirebaseService.Instance.currentQueue;
    if (!current) return null;
    return FirebaseService.Instance.rebuildAll(current);
  }

  get currentClassTime(): ClassTime | null {
    return FirebaseService.Instance.classTime?.data || null;
  }

  get currentAvailableStudent(): QueueItem | null {
    const queueRaw = FirebaseService.Instance.currentQueue;
    const uid = FirebaseService.Instance.currentUser?.uid;
    if (!queueRaw || !uid) return null;
    const queue = FirebaseService.Instance.rebuildAll(queueRaw);

    const currentOccupied = queue.occupied.find((i) => i.taId === uid);
    if (currentOccupied) {
      const currentStudent =
        queue.queue.find((i) => i.id === currentOccupied.studentId) || null;
      if (currentStudent) return currentStudent;
      FirebaseService.Instance.release(currentOccupied.studentId);
    }
    queue.queue.sort((a, b) => a.appliedAt - b.appliedAt);
    const availableStudent = queue.queue.filter(
      (i) => !queue.occupied.find((o) => o.studentId === i.id),
    )[0];
    if (availableStudent) {
      FirebaseService.Instance.occupy(availableStudent.id);
    }
    return availableStudent || null;
  }

  onAuthStateChanged(callback: (hasLogin: boolean) => void): AuthUnsubscribe {
    return FirebaseService.Instance.auth.onAuthStateChanged(
      (user) => callback(!!user),
      (error) => console.error(error),
    );
  }

  onClassTimeChanged(
    onEmit: (isSessionAlive: boolean, classTime?: ClassTime) => void,
  ): () => void {
    (async () => {
      await FirebaseService.Instance.isDataReady();
      onEmit(
        FirebaseService.Instance.isClassTimeValid(),
        FirebaseService.Instance.classTime?.data,
      );
      FirebaseService.Instance.classTimeChangedListeners.push(onEmit);
    })();
    return () => {
      const onEmitRef = onEmit;
      FirebaseService.Instance.classTimeChangedListeners =
        FirebaseService.Instance.classTimeChangedListeners.filter(
          (f) => f !== onEmitRef,
        );
    };
  }

  async onClassroomQueueChanged(
    onEmit: (classroomQueue?: ClassroomQueue) => void,
  ): Promise<FirestoreUnsubscribe | null> {
    await FirebaseService.Instance.isDataReady();
    const ref = FirebaseService.Instance.currentClassroomQueueRef;
    if (ref) {
      return onSnapshot(ref, (doc) => {
        if (doc.exists()) {
          const queue = doc.data() as ClassroomQueueFlatten;
          queue.queue.sort((a, b) => a.appliedAt - b.appliedAt);
          onEmit({
            occupied: queue.occupied,
            resolved: queue.resolved,
            queue: FirebaseService.Instance.rebuildQueue(queue.queue),
          });
        } else onEmit();
      });
    }
    return null;
  }

  async enqueue(item: QueueItem): Promise<void> {
    const ref = FirebaseService.Instance.currentClassroomQueueRef;
    if (!ref) return;
    await updateDoc(ref, {
      queue: arrayUnion(...FirebaseService.Instance.flattenQueue([item])),
    });
  }

  async dequeue(id: string): Promise<void> {
    if (!FirebaseService.Instance.currentQueue) return;
    const res = FirebaseService.Instance.currentQueue.queue.find(
      (q) => q.id === id,
    );
    const occupiedRes = FirebaseService.Instance.currentQueue.occupied.filter(
      (i) => i.studentId === id,
    )[0];
    const ref = FirebaseService.Instance.currentClassroomQueueRef;
    if (!ref || !res) return;
    const context: Record<string, FieldValue> = { queue: arrayRemove(res) };
    if (occupiedRes) context.occupied = arrayRemove(occupiedRes);
    await updateDoc(ref, context);
  }

  async dequeueAndEnqueueResolved(points: number): Promise<void> {
    if (!FirebaseService.Instance.currentQueue) return;
    const res = FirebaseService.Instance.currentAvailableStudent;
    const ref = FirebaseService.Instance.currentClassroomQueueRef;
    if (!ref || !res || !FirebaseService.Instance.currentUser) return;

    await updateDoc(ref, {
      queue: arrayRemove(...FirebaseService.Instance.flattenQueue([res])),
      resolved: arrayUnion({
        id: res.id,
        points,
        resolvedAt: Timestamp.now().toMillis(),
      }),
      occupied: arrayRemove({
        studentId: res.id,
        taId: FirebaseService.Instance.currentUser.uid,
      }),
    });
  }

  async enqueueResolve(id: string, points: number): Promise<void> {
    const ref = FirebaseService.Instance.currentClassroomQueueRef;
    if (!ref) return;
    await updateDoc(ref, {
      resolved: arrayUnion({
        id,
        points,
        resolvedAt: Timestamp.now().toMillis(),
      }),
    });
  }

  async occupy(id: string): Promise<void> {
    const ref = FirebaseService.Instance.currentClassroomQueueRef;
    if (!ref || !FirebaseService.Instance.currentUser) return;
    await updateDoc(ref, {
      occupied: arrayUnion({
        studentId: id,
        taId: FirebaseService.Instance.currentUser.uid,
      }),
    });
  }

  async release(id: string): Promise<void> {
    const ref = FirebaseService.Instance.currentClassroomQueueRef;
    if (!ref || !FirebaseService.Instance.currentUser) return;
    await updateDoc(ref, {
      occupied: arrayRemove({
        studentId: id,
        taId: FirebaseService.Instance.currentUser.uid,
      }),
    });
  }

  async getAllClassTime(): Promise<{ time: ClassTime; id: string }[] | null> {
    const res = await getDocs(
      collection(FirebaseService.Instance.db, "class-time"),
    );
    if (res.empty) return null;
    return res.docs
      .map((doc) => ({ time: doc.data() as ClassTime, id: doc.id }))
      .sort((a, b) => b.time.start.toMillis() - a.time.start.toMillis());
  }

  async getClassroomQueueById(id: string): Promise<ClassroomQueue> {
    const res = await getDoc(
      doc(FirebaseService.Instance.db, "classroom-queue", id),
    );
    return FirebaseService.Instance.rebuildAll(
      res.data() as ClassroomQueueFlatten,
    );
  }

  async createNewClassSession(
    startTime: Date,
    endTime: Date,
    maxPoints: number,
    thisWeekHomeworkUrl: string,
  ): Promise<void> {
    const docRef = await addDoc(
      collection(FirebaseService.Instance.db, "class-time"),
      {
        start: Timestamp.fromDate(startTime),
        end: Timestamp.fromDate(endTime),
        maxPoints,
        thisWeekHomeworkUrl,
      } as ClassTime,
    );
    await setDoc(
      doc(FirebaseService.Instance.db, "classroom-queue", docRef.id),
      {
        occupied: [],
        queue: [],
        resolved: [],
      },
    );
    await setDoc(doc(FirebaseService.Instance.db, "seats", docRef.id), {
      classTime: Timestamp.fromDate(startTime),
      sittingRecords: [],
    });
  }

  async deleteClassSession(id: string): Promise<void> {
    await deleteDoc(doc(FirebaseService.Instance.db, "class-time", id));
    await deleteDoc(doc(FirebaseService.Instance.db, "classroom-queue", id));
    await deleteDoc(doc(FirebaseService.Instance.db, "seats", id));
  }

  async getSeatRecordList(): Promise<SeatRecord[]> {
    const records = await getDocs(
      collection(FirebaseService.Instance.db, "seats"),
    );
    const rawData = records.docs
      .map((r) => r.data() as SeatRecordFlatten)
      .sort((a, b) => b.classTime.toMillis() - a.classTime.toMillis());

    const data: SeatRecord[] = [];
    for (const d of rawData) {
      const { sittingRecords, classTime } = d;
      const records: SeatRecord["sittingRecords"] = [];

      for (const { sittingRow, sittingCol, ...rest } of sittingRecords) {
        records.push({
          sitting: {
            row: sittingRow,
            col: sittingCol,
          },
          ...rest,
        });
      }

      data.push({
        classTime,
        sittingRecords: records,
      });
    }
    return data;
  }

  async acquireSeat(
    id: string,
    rotation: number,
    row: number,
    col: number,
  ): Promise<void> {
    const docId = FirebaseService.Instance.classTime?.id;
    if (!docId) return;
    await updateDoc(doc(FirebaseService.Instance.db, "seats", docId), {
      sittingRecords: arrayUnion({
        createAt: Timestamp.now().toMillis(),
        id,
        rotation,
        sittingRow: row,
        sittingCol: col,
      }),
    });
  }
}
