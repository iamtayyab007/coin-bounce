import express from "express";
import { registerUser, loginUser } from "../controller/authController.js";

const router = express.Router();

// register router
router.post("/register", registerUser);

// login router
router.post("/login", loginUser);

// user endpoints

// signup
//login
//logout
//refresh

// blog endpoint

//Crud
//create
//update
//read all blogs && read blogs by id
//delete

//comment endpoint
// create comment
// read comment by log id

export { router };
