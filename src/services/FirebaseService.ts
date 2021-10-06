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
  DocumentSnapshot,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  QuerySnapshot,
  setDoc,
  Timestamp,
  Unsubscribe as FirestoreUnsubscribe,
  updateDoc,
  where,
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
import { ClassroomQueue, QueueItem } from "../entities/ClassroomQueue";

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

  private previousSessionState: boolean = false;
  private classTime?: { id: string; data: ClassTime } | null;
  private classTimeChangedListeners: ((
    isSessionAlive: boolean,
    classTime?: ClassTime
  ) => void)[] = [];
  private currentQueue?: ClassroomQueue;

  private async queryDatabase() {
    const classTimeQ = query(
      collection(this.db, "class-time"),
      where("end", ">=", Timestamp.now())
    );
    const classTimeQR = await getDocs(classTimeQ);
    if (classTimeQR.empty) FirebaseService.Instance.classTime = null;
    classTimeQR.forEach((doc) => {
      const data = doc.data() as ClassTime;
      if (data.start.toMillis() <= Timestamp.now().toMillis()) {
        FirebaseService.Instance.classTime = { id: doc.id, data };
      }
    });
  }

  private async startTimer() {
    setInterval(() => {
      const currentSessionState = FirebaseService.Instance.isClassTimeValid();
      if (
        FirebaseService.Instance.previousSessionState !== currentSessionState
      ) {
        FirebaseService.Instance.previousSessionState = currentSessionState;
        FirebaseService.Instance.classTimeChangedListeners.forEach((e) =>
          e(currentSessionState, FirebaseService.Instance.classTime?.data)
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
          FirebaseService.Instance.classTime.id
        ),
        (doc) => {
          if (FirebaseService.Instance.classTime)
            FirebaseService.Instance.classTime.data = doc.data() as ClassTime;
        }
      );
    }
    FirebaseService.Instance.onClassroomQueueChanged((classroomQueue) => {
      FirebaseService.Instance.currentQueue = classroomQueue;
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
      FirebaseService.Instance.classTime.id
    );
  }

  isDataReady() {
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

  async createAccount(email: string, password: string = "soselab401") {
    await createUserWithEmailAndPassword(
      FirebaseService.Instance.auth,
      email,
      password
    );
  }

  async signIn(email: string, password: string): Promise<User | null> {
    if (FirebaseService.Instance.currentUser)
      return FirebaseService.Instance.currentUser;
    try {
      await signInWithEmailAndPassword(
        FirebaseService.Instance.auth,
        email,
        password
      );
    } catch (error) {
      console.error(error);
    }
    return FirebaseService.Instance.currentUser;
  }

  async signOut() {
    await FirebaseService.Instance.auth.signOut();
  }

  async changePassword(newPasswd: string) {
    if (!FirebaseService.Instance.currentUser) return;
    await updatePassword(FirebaseService.Instance.currentUser, newPasswd);
  }

  get currentUser(): User | null {
    return FirebaseService.Instance.auth.currentUser;
  }

  get hasLogin(): Promise<boolean> {
    return new Promise<boolean>((res) =>
      FirebaseService.Instance.auth.onAuthStateChanged((user) => res(!!user))
    );
  }

  get currentWaitingQueue(): ClassroomQueue | null {
    return FirebaseService.Instance.currentQueue || null;
  }

  get currentClassTime(): ClassTime | null {
    return FirebaseService.Instance.classTime?.data || null;
  }

  get currentAvailableStudent(): QueueItem | null {
    const queue = FirebaseService.Instance.currentQueue;
    const uid = FirebaseService.Instance.currentUser?.uid;
    if (!queue || !uid) return null;

    const currentOccupied = queue.occupied.find((i) => i.taId === uid);
    if (currentOccupied) {
      const currentStudent =
        queue.queue.find((i) => i.id === currentOccupied.studentId) || null;
      if (currentStudent) return currentStudent;
      FirebaseService.Instance.release(currentOccupied.studentId);
    }
    queue.queue.sort((a, b) => a.appliedAt.toMillis() - b.appliedAt.toMillis());
    const availableStudent = queue.queue.filter(
      (i) => !queue.occupied.find((o) => o.studentId === i.id)
    )[0];
    if (availableStudent) {
      FirebaseService.Instance.occupy(availableStudent.id);
    }
    return availableStudent || null;
  }

  onAuthStateChanged(callback: (hasLogin: boolean) => void): AuthUnsubscribe {
    return FirebaseService.Instance.auth.onAuthStateChanged(
      (user) => callback(!!user),
      (error) => console.error(error)
    );
  }

  onClassTimeChanged(
    onEmit: (isSessionAlive: boolean, classTime?: ClassTime) => void
  ): () => void {
    (async () => {
      await FirebaseService.Instance.isDataReady();
      onEmit(
        FirebaseService.Instance.isClassTimeValid(),
        FirebaseService.Instance.classTime?.data
      );
      FirebaseService.Instance.classTimeChangedListeners.push(onEmit);
    })();
    return () => {
      const onEmitRef = onEmit;
      FirebaseService.Instance.classTimeChangedListeners =
        FirebaseService.Instance.classTimeChangedListeners.filter(
          (f) => f !== onEmitRef
        );
    };
  }

  async onClassroomQueueChanged(
    onEmit: (classroomQueue?: ClassroomQueue) => void
  ): Promise<FirestoreUnsubscribe | null> {
    await FirebaseService.Instance.isDataReady();
    const ref = FirebaseService.Instance.currentClassroomQueueRef;
    if (ref) {
      return onSnapshot(ref, (doc) => {
        if (doc.exists()) {
          const queue = doc.data() as ClassroomQueue;
          queue.queue.sort(
            (a, b) => a.appliedAt.toMillis() - b.appliedAt.toMillis()
          );
          onEmit(queue);
        } else onEmit();
      });
    }
    return null;
  }

  async enqueue(item: QueueItem) {
    const ref = FirebaseService.Instance.currentClassroomQueueRef;
    if (!ref) return;
    await updateDoc(ref, {
      queue: arrayUnion(item),
    });
  }

  async dequeue(id: string) {
    if (!FirebaseService.Instance.currentQueue) return;
    const res = FirebaseService.Instance.currentQueue.queue.find(
      (q) => q.id === id
    );
    const occupiedRes = FirebaseService.Instance.currentQueue.occupied.filter(
      (i) => i.studentId === id
    )[0];
    const ref = FirebaseService.Instance.currentClassroomQueueRef;
    if (!ref || !res) return;
    let context: any = {
      queue: arrayRemove(res),
    };
    if (occupiedRes)
      context = {
        ...context,
        occupied: arrayRemove(occupiedRes),
      };
    await updateDoc(ref, context);
  }

  async dequeueAndEnqueueResolved(points: number) {
    if (!FirebaseService.Instance.currentQueue) return;
    const res = FirebaseService.Instance.currentAvailableStudent;
    const ref = FirebaseService.Instance.currentClassroomQueueRef;
    if (!ref || !res || !FirebaseService.Instance.currentUser) return;

    await updateDoc(ref, {
      queue: arrayRemove(res),
      resolved: arrayUnion({
        id: res.id,
        points,
        resolvedAt: Timestamp.now(),
      }),
      occupied: arrayRemove({
        studentId: res.id,
        taId: FirebaseService.Instance.currentUser.uid,
      }),
    });
  }

  async enqueueResolve(id: string, points: number) {
    const ref = FirebaseService.Instance.currentClassroomQueueRef;
    if (!ref) return;
    await updateDoc(ref, {
      resolved: arrayUnion({
        id,
        points,
        resolvedAt: Timestamp.now(),
      }),
    });
  }

  async occupy(id: string) {
    const ref = FirebaseService.Instance.currentClassroomQueueRef;
    if (!ref || !FirebaseService.Instance.currentUser) return;
    await updateDoc(ref, {
      occupied: arrayUnion({
        studentId: id,
        taId: FirebaseService.Instance.currentUser.uid,
      }),
    });
  }

  async release(id: string) {
    const ref = FirebaseService.Instance.currentClassroomQueueRef;
    if (!ref || !FirebaseService.Instance.currentUser) return;
    await updateDoc(ref, {
      occupied: arrayRemove({
        studentId: id,
        taId: FirebaseService.Instance.currentUser.uid,
      }),
    });
  }

  async getAllClassTime(): Promise<QuerySnapshot<DocumentData>> {
    return await getDocs(collection(FirebaseService.Instance.db, "class-time"));
  }

  async getClassroomQueueById(
    id: string
  ): Promise<DocumentSnapshot<DocumentData>> {
    return await getDoc(
      doc(FirebaseService.Instance.db, "classroom-queue", id)
    );
  }

  async createNewClassSession(
    startTime: Date,
    endTime: Date,
    maxPoints: number,
    thisWeekHomeworkUrl: string
  ) {
    const docRef = await addDoc(
      collection(FirebaseService.Instance.db, "class-time"),
      {
        start: Timestamp.fromDate(startTime),
        end: Timestamp.fromDate(endTime),
        maxPoints,
        thisWeekHomeworkUrl,
      } as ClassTime
    );
    await setDoc(
      doc(FirebaseService.Instance.db, "classroom-queue", docRef.id),
      {
        occupied: [],
        queue: [],
        resolved: [],
      }
    );
  }

  async deleteClassSession(id: string) {
    await deleteDoc(doc(FirebaseService.Instance.db, "class-time", id));
    await deleteDoc(doc(FirebaseService.Instance.db, "classroom-queue", id));
  }
}
