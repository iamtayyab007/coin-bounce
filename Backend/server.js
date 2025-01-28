import express from "express";
import { dbConnect } from "./database/db.js";
import { PORT } from "./config/index.js";
import { router } from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
app.use(express.json());
const PORTNAME = PORT;

dbConnect();

app.get("/", (req, res) => {
  res.json({ msg: "hi there 777" });
});

app.use(router);

app.use(errorHandler);

app.listen(
  PORT,
  console.log(`Port is running on port: http://localhost:${PORTNAME}`)
);
