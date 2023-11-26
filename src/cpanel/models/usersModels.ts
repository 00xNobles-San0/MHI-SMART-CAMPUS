export interface User {
  id:string
  userId:string;
  name: string;
  username?: string;
  password?: string;
  role: string;
  email: string;
  phoneNumber: string;
  firebaseUid?:string
} 
