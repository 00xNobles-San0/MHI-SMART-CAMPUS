import UserService from "../services/users"
import json from "./students.json"
const service = new UserService()
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
for (let i = 0; i < json.length; i++) {
  const student = json[i];
  service.createUser({
    id:"",
    userId:student.userId,
    name:student.name,
    role:student.role,
    email:student.email,
    phoneNumber:student.phoneNumber,
  })
}