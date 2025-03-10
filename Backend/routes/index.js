import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refresh,
} from "../controller/authController.js";
import { auth } from "../middlewares/auth.js";
import {
  create,
  getAll,
  getById,
  update,
  deleteById,
} from "../controller/blogController.js";
import {
  createComment,
  getByIdComment,
} from "../controller/commentController.js";

const router = express.Router();

// user endpoints

// register router
router.post("/register", registerUser);

// login router
router.post("/login", loginUser);

// logout router
router.post("/logout", auth, logoutUser);

//refresh

router.get("/refresh", refresh);

// blog endpoint

//Crud

//create
router.post("/blog", auth, create);

//read all blogs
router.get("/blog/all", auth, getAll);
//read blogs by id
router.get("/blogs/:id", auth, getById);
//update
router.put("/blog", auth, update);
//delete
router.delete("/blog/:id", auth, deleteById);

//comment endpoint

// create comment
router.post("/comment", auth, createComment);
// read comment by log id
router.get("/comment/:id", auth, getByIdComment);
export { router };
