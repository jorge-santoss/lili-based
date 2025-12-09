// src/api/auth.js
import instance from "./config";
import axios from "axios";

async function signIn(data) {
  return instance.post("/api/login", data);
}

async function listUsersExample() {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/users"
    );
    return response.data;
  } catch (error) {
    return error;
  }
}

// for registration
async function signUp(data) {
  return instance.post("/api/register", data);
}

export { signIn, listUsersExample, signUp };
