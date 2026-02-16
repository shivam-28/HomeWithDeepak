import {
  GoogleAuthProvider,
  signInWithRedirect,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { getClientAuth } from "./config";

const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  const auth = getClientAuth();
  await signInWithRedirect(auth, googleProvider);
}

export async function signOut() {
  const auth = getClientAuth();
  await firebaseSignOut(auth);
}
