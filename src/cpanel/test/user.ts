import UserService from "../services/users"
import json from "./student.json"
const service = new UserService()
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

for (let i = 0; i < json.length; i++) {
  await delay(500)
  const student = json[i];
  service.createUser(
    {
      id:student.id,
      name: student.name,
      role: "student",
      email: "",
      phoneNumber: "",
    }
  )
}


// service.deleteAllUsers()