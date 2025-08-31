import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";  // already created firebase.js

// Save user info to Firestore after sign-in
export async function UserProfile(user) {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  
  
}
