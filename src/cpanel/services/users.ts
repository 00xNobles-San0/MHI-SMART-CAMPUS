// UserService.ts
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc, deleteDoc, updateDoc, getDocs } from "firebase/firestore";
import firebaseConfig from "../../../firebase.json";
import { User } from "../models/usersModels";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

class UserService {
  private firestore;
  private collectionRef;

  constructor() {
    this.firestore = getFirestore(app);
    this.collectionRef = collection(this.firestore, 'users');
  }

  private getUserDocRef(userId: string) {
    return doc(this.collectionRef, userId);
  }

  async getUsers() {
    const querySnapshot = await getDocs(this.collectionRef);
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data() as User,
    }));
    return documents;
  }

  async createUser(user: User) {
    const userDocRef = doc(this.collectionRef, user.id!);
    await setDoc(userDocRef, user);
    return user.id;
  }

  async getUserById(userId: string) {
    const userDocRef = this.getUserDocRef(userId);
    const userSnapshot = await getDoc(userDocRef);
    return userSnapshot.exists() ? userSnapshot.data() : null;
  }

  async updateUser(userId: string, updatedUserData: Partial<User>) {
    const userDocRef = this.getUserDocRef(userId);
    await updateDoc(userDocRef, updatedUserData);
  }

  async deleteUser(userId: string) {
    const userDocRef = this.getUserDocRef(userId);
    await deleteDoc(userDocRef);
  }
}

export default UserService;
