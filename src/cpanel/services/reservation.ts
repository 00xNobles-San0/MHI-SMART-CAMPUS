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
    return doc(this.firestore, 'reservation', reservationId);
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
    const reservationDocRef = doc(this.collectionRef, newReservationId);
    const spaces = await this.parkingSpaceService.getParkingSpaces();
    let reservation: Reservation | undefined;

    spaces.some((space) => {
      if (space.data.status === "empty") {
        reservation = {
          id: newReservationId,
          userId,
          parkingSpaceId: space.id,
          key: "",
          status: "pending",
          location: space.data.location,
        };
        return true;
      }
      return false;
    });

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
