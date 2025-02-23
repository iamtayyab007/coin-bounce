import express from "express";
import cookieParser from "cookie-parser";
import { dbConnect } from "./database/db.js";
import { PORT } from "./config/index.js";
import { router } from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
app.use(cookieParser());
app.use(express.json());

const PORTNAME = PORT;

dbConnect();

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
