import { initializeApp } from "firebase/app";
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
    this.auth = getAuth();
  }
  private app;
  private auth;

  private user?: User;

  async createAccount(
    email: string,
    password: string = "soselab401"
  ): Promise<boolean> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        FirebaseService.Instance.auth,
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
        FirebaseService.Instance.auth,
        email,
        password
      );
      FirebaseService.Instance.user = userCredential.user;
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

  get hasLogin(): boolean {
    return !!FirebaseService.Instance.currentUser;
  }
}
