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
    const querySnapshot = await getDocs(this.collectionRef);
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data() as Reservation,
    }));
    return documents;
  }

  async createReservation(userId: string) {
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
  }
  
  

  async getReservationById(reservationId: string) {
    const reservationDocRef = this.getReservationDocRef(reservationId);
    const reservationSnapshot = await getDoc(reservationDocRef);
    return reservationSnapshot.exists() ? reservationSnapshot.data() : null;
  }

  async updateReservation(reservationId: string, updatedReservationData: Partial<Reservation>) {
    const reservationDocRef = this.getReservationDocRef(reservationId);
    await updateDoc(reservationDocRef, updatedReservationData);
  }

  async deleteReservation(reservationId: string) {
    const reservationDocRef = this.getReservationDocRef(reservationId);
    await deleteDoc(reservationDocRef);
  }
}

export default ReservationService;
