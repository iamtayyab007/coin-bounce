import express from "express";
import cookieParser from "cookie-parser";
import { dbConnect } from "./database/db.js";
import { PORT } from "./config/index.js";
import { router } from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import cors from "cors";

const app = express();
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));

const PORTNAME = PORT;

dbConnect();

// cors
const corsData = {
  origin: "http://localhost:5173", // Allow only this origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed request methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  credentials: true, // Allow cookies (important if using authentication)
};

app.use(cors(corsData));
app.use("/storage", express.static("storage"));

app.get("/", (req, res) => {
  res.json({ msg: "hi there 777" });
});

app.use(router);

app.use(errorHandler);

app.listen(
  PORT,
  console.log(`Port is running on port: http://localhost:${PORTNAME}`)
);
