// ParkingSpaceService.ts
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc, deleteDoc, updateDoc, getDocs  } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

import firebaseConfig from "../../../firebase.json";
import { ParkingSpace } from "../models/parkingspaceModels";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

class ParkingSpaceService {
  private firestore;
  ref: any;

  constructor() {
    this.firestore = getFirestore(app);
    this.ref = doc(this.firestore, 'mhismart_campus', 'parking_spaces');
  }

  // Helper function to get a parking space document reference by ID
  private getParkingSpaceDocRef(spaceId: string) {
    return doc(this.firestore, 'mhismart_campus', 'parking_spaces', "space_data" ,spaceId);
  }

  async getParkingSpaces() {
    const querySnapshot  = await getDocs(collection(this.ref,"space_data"));
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return documents;
  }
  // Create a new parking space
  async createParkingSpace(space: ParkingSpace) {
    const spaceId = uuidv4();
    const spaceDocRef = this.ref;
    const userCollectionRef = collection(spaceDocRef, 'space_data');
    const namedDocRef = doc(userCollectionRef, spaceId);
    await setDoc(namedDocRef, space);
    return spaceId;
  }

  // Read parking space by ID
  async getParkingSpaceById(spaceId: string) {
    const spaceDocRef = this.getParkingSpaceDocRef(spaceId);
    const spaceSnapshot = await getDoc(spaceDocRef);
    if (spaceSnapshot.exists()) {
      return spaceSnapshot.data();
    } else {
      return null;
    }
  }

  // Update parking space by ID
  async updateParkingSpace(spaceId: string, updatedSpaceData: Partial<ParkingSpace>) {
    const spaceDocRef = this.getParkingSpaceDocRef(spaceId);
    await updateDoc(spaceDocRef, updatedSpaceData);
  }

  // Delete parking space by ID
  async deleteParkingSpace(spaceId: string) {
    const spaceDocRef = this.getParkingSpaceDocRef(spaceId);
    await deleteDoc(spaceDocRef);
  }
}

export default ParkingSpaceService;
