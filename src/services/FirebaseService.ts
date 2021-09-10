import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import Config from "../../Config";
import ClassTime from "../entities/ClassTime";
import { ClassroomQueue } from "../entities/ClassroomQueue";

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
          e(currentSessionState)
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

  async createAccount(
    email: string,
    password: string = "soselab401"
  ): Promise<boolean> {
    try {
      await createUserWithEmailAndPassword(
        FirebaseService.Instance.auth,
        email,
        password
      );
    } catch (error) {
      console.error(error);
      return false;
    }
    return true;
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

  get currentUser(): User | null {
    return FirebaseService.Instance.auth.currentUser;
  }

  get hasLogin(): Promise<boolean> {
    return new Promise<boolean>((res) =>
      FirebaseService.Instance.auth.onAuthStateChanged((user) => res(!!user))
    );
  }

  onAuthStateChanged(
    callback: (hasLogin: boolean) => void,
    activateOn: (hasLogin: boolean) => boolean
  ) {
    FirebaseService.Instance.auth.onAuthStateChanged(
      (user) => activateOn(!!user) && callback(!!user)
    );
  }

  private isClassTimeValid(): boolean {
    if (!FirebaseService.Instance.classTime) return false;
    const { start, end } = FirebaseService.Instance.classTime.data;
    return (
      start.toMillis() <= Timestamp.now().toMillis() &&
      end.toMillis() >= Timestamp.now().toMillis()
    );
  }

  async onClassTimeChanged(
    onEmit: (isSessionAlive: boolean, classTime?: ClassTime) => void
  ) {
    await FirebaseService.Instance.isDataReady();
    onEmit(
      FirebaseService.Instance.isClassTimeValid(),
      FirebaseService.Instance.classTime?.data
    );
    FirebaseService.Instance.classTimeChangedListeners.push(onEmit);
  }

  async onClassroomQueueChanged(
    onEmit: (classroomQueue?: ClassroomQueue) => void
  ) {
    await FirebaseService.Instance.isDataReady();
    if (FirebaseService.Instance.classTime) {
      onSnapshot(
        doc(
          FirebaseService.Instance.db,
          "classroom-queue",
          FirebaseService.Instance.classTime.id
        ),
        (doc) => {
          if (doc.exists()) onEmit(doc.data() as ClassroomQueue);
          else onEmit();
        }
      );
    }
  }

  test() {
    FirebaseService.Instance.onClassTimeChanged((isSessionValid, classTime) => {
      console.log(isSessionValid, classTime);
    });
    FirebaseService.Instance.onClassroomQueueChanged((classroomQueue) => {
      console.log(classroomQueue);
    });
  }
}
