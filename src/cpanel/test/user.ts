import UserService from "../services/users"
const service = new UserService()
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
