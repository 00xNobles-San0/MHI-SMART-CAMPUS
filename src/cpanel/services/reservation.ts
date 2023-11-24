import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

import firebaseConfig from "../../../firebase.json";
import { Reservation } from "../models/reservationModels";
import ParkingSpaceService from "../services/parkingspace"
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const space = new ParkingSpaceService()
class ReservationService {
  private firestore;
  ref: any;

  constructor() {
    this.firestore = getFirestore(app);
    this.ref = doc(this.firestore, 'mhismart_campus', 'reservation')
  }

  // Helper function to get a reservation document reference by ID
  private getReservationDocRef(reservationId: string) {
    return doc(this.firestore, 'mhismart_campus', 'reservation', reservationId,"reservation_data");
  }

  // Create a new reservation
  async createReservation(userId: string) {
    const newReservationId = uuidv4();
    const reservationDocRef = this.ref
    const reservationCollectionRef = collection(reservationDocRef, newReservationId);
    const namedDocRef = doc(reservationCollectionRef, 'reservation_data');
    const spaces = await space.getParkingSpaces()
    spaces.forEach(space => {
      space
    });
    const reservation = {}
    await setDoc(namedDocRef,reservation );
    return newReservationId;
  }

  // Read reservation by ID
  async getReservationById(reservationId: string) {
    const reservationDocRef =  this.getReservationDocRef(reservationId);
    const reservationSnapshot = await getDoc(reservationDocRef);
    if (reservationSnapshot.exists()) {
      return reservationSnapshot.data();
    } else {
      return null;
    }
  }

  // Update reservation by ID
  async updateReservation(reservationId: string, updatedReservationData: Partial<Reservation>) {
    const reservationDocRef = this.getReservationDocRef(reservationId);
    await updateDoc(reservationDocRef, updatedReservationData);
  }

  // Delete reservation by ID
  async deleteReservation(reservationId: string) {
    const reservationDocRef = this.getReservationDocRef(reservationId);
    await deleteDoc(reservationDocRef);
  }

}

export default ReservationService;
