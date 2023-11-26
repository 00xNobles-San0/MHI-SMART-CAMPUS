import UserService from "../services/users"
import json from "./student.json"
const service = new UserService()
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

for (let i = 0; i < json.length; i++) {
  await delay(2000)
  console.log(i)
  const student = json[i];
  service.createUser(
    {
      id:"",
      userId:student.id,
      name: student.name,
      role: "student",
      email: "",
      phoneNumber: "",
    }
  )
}


// service.deleteAllUsers()