import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;
const mongoDB_URI = process.env.MONGODB_CONNECTION_STRING;
const BACKEND_SERVER_PATH = process.env.BACKEND_SERVER_PATH;
const ACCESS_TOKEN_SECRET =
  "c223f402bc8e53967f1e1ee23b7762e5988d05137da3b37e9ee1d860a7144a21f41ce12aefb2370ee92207bacc7db8be65436b36288326e1c7ce4675c5b88c5d";
const REFRESH_TOKEN_SECRET =
  "327aa9db05c8f93ecbbe2059d945de13390179eda7734e49f32b5540f1ea461eeb6eee9abca2ea48ae58a274793e87bd15cdd9b69ec61b1b50e263f795c6ef68";

export {
  PORT,
  mongoDB_URI,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  BACKEND_SERVER_PATH,
};
