import mongoose from "mongoose";
import { mongoDB_URI } from "../config/index.js";

const connectionString = mongoDB_URI;

async function dbConnect() {
  try {
    const connection = await mongoose.connect(connectionString);
    if (connection) {
      console.log(
        `Connected Successfully to host: ${connection.connection.host}`
      );
    }
  } catch (error) {
    console.log(error.message);
  }
}

export { dbConnect };
