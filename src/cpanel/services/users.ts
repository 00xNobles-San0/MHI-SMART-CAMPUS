// UserService.ts
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc, deleteDoc, updateDoc, getDocs } from "firebase/firestore";
import firebaseConfig from "../../../firebase.json";
import serviceAccount  from "../../../mhismartcampus-firebase-adminsdk-tglra-46bcf22e8f.json";
import { User } from "../models/usersModels";
import {
  getAuth,
  createUserWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";

import admin from 'firebase-admin';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

class UserService {
  private firestore;
  private collectionRef;
  private auth;
  private admin;

  constructor() {
    this.firestore = getFirestore(app);
    this.collectionRef = collection(this.firestore, 'users');
    this.auth = getAuth();
    this.admin = admin;
  }

  private getUserDocRef(userId: string) {
    return doc(this.collectionRef, userId);
  }

  private generateRandomString(length: number): string {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  async getUsers() {
    try {
      const querySnapshot = await getDocs(this.collectionRef);
      const documents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data() as User,
      }));
      return documents;
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  }

  async createUser(user: User) {
    try {
      const userDocRef = doc(this.collectionRef, user.id);
      user.username = `${this.generateRandomString(10)}@example.com`;
      user.password = this.generateRandomString(10);

      const userCredential: UserCredential = await createUserWithEmailAndPassword(this.auth, user.username, user.password);
      const firebaseUser = userCredential.user;

      // Remove the password field before storing user data in Firestore
      const { password, ...userDataWithoutPassword } = user;

      // Set user data in Firestore
      console.log(user.id)
      await setDoc(userDocRef, {
        ...userDataWithoutPassword,
        firebaseUid: firebaseUser.uid,
      });

      return user.id;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async getUserById(userId: string) {
    try {
      const userDocRef = this.getUserDocRef(userId);
      const userSnapshot = await getDoc(userDocRef);
      return userSnapshot.exists() ? userSnapshot.data() : null;
    } catch (error) {
      console.error(`Error getting user with ID ${userId}:`, error);
      throw error;
    }
  }

  async updateUser(userId: string, updatedUserData: Partial<User>) {
    try {
      const userDocRef = this.getUserDocRef(userId);
      await updateDoc(userDocRef, updatedUserData);
    } catch (error) {
      console.error(`Error updating user with ID ${userId}:`, error);
      throw error;
    }
  }

  async deleteUser(userId: string) {
    try {
      const userDocRef = this.getUserDocRef(userId);
      const user = await this.getUserById(userId) as any;

      if (user) {
        await this.admin.auth().deleteUser(user.uid);
        await deleteDoc(userDocRef);
        console.log(`Successfully deleted user with ID: ${userId}`);
      } else {
        console.log(`User with ID ${userId} not found.`);
      }
    } catch (error) {
      console.error(`Error deleting user with ID ${userId}:`, error);
      throw error;
    }
  }

  async deleteAllUsers() {
    try {
      const users = await this.getUsers();

      // Use Promise.all to wait for all deletions to complete
      await Promise.all(users.map(async (u) => {
        const user = u.data;
        const userDocRef = this.getUserDocRef(user.id);

        await this.admin.auth().deleteUser(user.uid);
        await deleteDoc(userDocRef);

        console.log(`Successfully deleted user with ID: ${user.id}`);
      }));

      console.log('All users deleted successfully.');
    } catch (error) {
      console.error('Error deleting users:', error);
      throw error;
    }
  }
}

export default UserService;
