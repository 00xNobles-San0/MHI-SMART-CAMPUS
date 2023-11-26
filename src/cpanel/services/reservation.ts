// ReservationService.ts
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc, deleteDoc, updateDoc, getDocs } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import firebaseConfig from "../../../firebase.json";
import { Reservation } from "../models/reservationModels";
import ParkingSpaceService from "../services/parkingspace";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

class ReservationService {
  private firestore;
  private collectionRef;
  private parkingSpaceService;

  constructor() {
    this.firestore = getFirestore(app);
    this.collectionRef = collection(this.firestore, 'reservation');
    this.parkingSpaceService = new ParkingSpaceService();
  }

  private getReservationDocRef(reservationId: string) {
    return doc(this.collectionRef, reservationId);
  }

  async getReservations() {
    try {
      const querySnapshot = await getDocs(this.collectionRef);
      const documents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data() as Reservation,
      }));
      return documents;
    } catch (error) {
      console.error('Error getting reservations:', error);
      throw error;
    }
  }

  async createReservation(userId: string) {
    try {
      const newReservationId = uuidv4();
      const spaces = await this.parkingSpaceService.getParkingSpaces();
      const emptySpace = spaces.find(space => space.data.status === "empty");
  
      if (!emptySpace) {
        return null; 
      }
  
      const { id: parkingSpaceId, location } = emptySpace.data;
      const reservation: Reservation = {
        id: newReservationId,
        userId,
        parkingSpaceId,
        key: "",
        status: "pending",
        location,
      };
  
      const reservationDocRef = doc(this.collectionRef, newReservationId);
      await setDoc(reservationDocRef, reservation);
  
      return newReservationId;
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  }
  
  async getReservationById(reservationId: string) {
    try {
      const reservationDocRef = this.getReservationDocRef(reservationId);
      const reservationSnapshot = await getDoc(reservationDocRef);
      return reservationSnapshot.exists() ? reservationSnapshot.data() : null;
    } catch (error) {
      console.error(`Error getting reservation with ID ${reservationId}:`, error);
      throw error;
    }
  }

  async updateReservation(reservationId: string, updatedReservationData: Partial<Reservation>) {
    try {
      const reservationDocRef = this.getReservationDocRef(reservationId);
      await updateDoc(reservationDocRef, updatedReservationData);
    } catch (error) {
      console.error(`Error updating reservation with ID ${reservationId}:`, error);
      throw error;
    }
  }

  async deleteReservation(reservationId: string) {
    try {
      const reservationDocRef = this.getReservationDocRef(reservationId);
      await deleteDoc(reservationDocRef);
    } catch (error) {
      console.error(`Error deleting reservation with ID ${reservationId}:`, error);
      throw error;
    }
  }
}

export default ReservationService;
