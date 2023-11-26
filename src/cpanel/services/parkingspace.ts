// ParkingSpaceService.ts
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc, deleteDoc, updateDoc, getDocs, query, where } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import firebaseConfig from "../../../firebase.json";
import { ParkingSpace } from "../models/parkingspaceModels";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

class ParkingSpaceService {
  private firestore;
  private collectionRef;

  constructor() {
    this.firestore = getFirestore(app);
    this.collectionRef = collection(this.firestore, 'parking_spaces');
  }

  private getParkingSpaceDocRef(spaceId: string) {
    return doc(this.collectionRef, spaceId);
  }

  async createParkingSpace(space: ParkingSpace) {
    try {
      const spaceId = uuidv4();
      const spaceDocRef = doc(this.collectionRef, spaceId);
      await setDoc(spaceDocRef, space);
      return spaceId;
    } catch (error) {
      console.error('Error creating parking space:', error);
      throw error;
    }
  }

  async getParkingSpacesByLocation(location: string) {
    try {
      const locationQuery = query(this.collectionRef, where("location", "==", location));
      const querySnapshot = await getDocs(locationQuery);
  
      if (querySnapshot.size !== 1) {
        if (querySnapshot.size === 0) {
          return null;
        } else {
          throw new Error("Multiple documents found for the same location");
        }
      }
  
      const [doc] = querySnapshot.docs;
      return {
        id: doc.id,
        data: doc.data() as ParkingSpace,
      };
    } catch (error) {
      console.error(`Error getting parking space by location ${location}:`, error);
      throw error;
    }
  }
  
  
  async getParkingSpaces() {
    try {
      const querySnapshot = await getDocs(this.collectionRef);
      const documents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data() as ParkingSpace,
      }));
      return documents;
    } catch (error) {
      console.error('Error getting parking spaces:', error);
      throw error;
    }
  }

  async getParkingSpaceById(spaceId: string) {
    try {
      const spaceDocRef = this.getParkingSpaceDocRef(spaceId);
      const spaceSnapshot = await getDoc(spaceDocRef);
      return spaceSnapshot.exists() ? spaceSnapshot.data() : null;
    } catch (error) {
      console.error(`Error getting parking space by ID ${spaceId}:`, error);
      throw error;
    }
  }

  async updateParkingSpace(spaceId: string, updatedSpaceData: Partial<ParkingSpace>) {
    try {
      const spaceDocRef = this.getParkingSpaceDocRef(spaceId);
      await updateDoc(spaceDocRef, updatedSpaceData);
    } catch (error) {
      console.error(`Error updating parking space by ID ${spaceId}:`, error);
      throw error;
    }
  }

  async deleteParkingSpace(spaceId: string) {
    try {
      const spaceDocRef = this.getParkingSpaceDocRef(spaceId);
      await deleteDoc(spaceDocRef);
    } catch (error) {
      console.error(`Error deleting parking space by ID ${spaceId}:`, error);
      throw error;
    }
  }
}

export default ParkingSpaceService;
