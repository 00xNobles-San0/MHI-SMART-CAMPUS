import UserService from "../services/users"
import json from "./student.json"
const service = new UserService()
for (let i = 0; i < json.length; i++) {
  const student = json[i];
  service.createUser(
    {
      id:student.id,
      name: student.name,
      userName: "john_doe",
      password: "password123",
      role: "student",
      email: "",
      phoneNumber: "",
    }
  )
}

