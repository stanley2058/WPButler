import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import Config from "../../Config";

export default class FirebaseService {
  private static instance: FirebaseService;
  static get Instance() {
    if (!FirebaseService.instance)
      FirebaseService.instance = new FirebaseService();
    return FirebaseService.instance;
  }
  private constructor() {
    this.app = initializeApp(Config.firebaseConfig);
    this.analytics = getAnalytics(this.app);
    this.auth = getAuth();
  }
  private app;
  private analytics;
  private auth;

  private user?: User;

  async createAccount(
    email: string,
    password: string = "soselab401"
  ): Promise<boolean> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      FirebaseService.Instance.user = userCredential.user;
    } catch (error) {
      console.error(error);
      return false;
    }
    return true;
  }

  async signIn(email: string, password: string): Promise<User | null> {
    if (FirebaseService.Instance.user)
      return FirebaseService.Instance.currentUser;
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      FirebaseService.Instance.user = userCredential.user;
    } catch (error) {
      console.error(error);
    }
    return FirebaseService.Instance.currentUser;
  }

  get currentUser(): User | null {
    return FirebaseService.Instance.user || null;
  }
}
