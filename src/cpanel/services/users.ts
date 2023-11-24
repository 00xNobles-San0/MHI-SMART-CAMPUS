import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
// import { v4 as uuidv4 } from "uuid";

import firebaseConfig from "../../firebase-key.json";
import { User } from "../models/usersModels";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

class UserService {
  private firestore;
  ref: any;

  constructor() {
    this.firestore = getFirestore(app);
    this.ref = doc(this.firestore, 'mhismart_campus', 'users')
  }

  // Helper function to get a user document reference by ID
  private getUserDocRef(userId: string) {
    return doc(this.ref, userId,"user_data");
  }

  // Create a new user
  async createUser(user: User) {
    // const newUserId = uuidv4();
    const userDocRef = this.ref
    const userCollectionRef = collection(userDocRef, user.id!);
    const namedDocRef = doc(userCollectionRef, 'user_data');
    await setDoc(namedDocRef, user);
    return user.id;
  }

  // Read user by ID
  async getUserById(userId: string) {
    const userDocRef =  this.getUserDocRef(userId);
    const userSnapshot = await getDoc(userDocRef);
    if (userSnapshot.exists()) {
      return userSnapshot.data();
    } else {
      return null;
    }
  }

  // Update user by ID
  async updateUser(userId: string, updatedUserData: Partial<User>) {
    const userDocRef = this.getUserDocRef(userId);
    await updateDoc(userDocRef, updatedUserData);
  }

  // Delete user by ID
  async deleteUser(userId: string) {
    const userDocRef = this.getUserDocRef(userId);
    await deleteDoc(userDocRef);
  }

}

export default UserService;
