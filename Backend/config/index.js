import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;
const mongoDB_URI = process.env.MONGODB_CONNECTION_STRING;

export { PORT, mongoDB_URI };
