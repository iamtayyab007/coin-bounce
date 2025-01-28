import Joi from "joi";
import User from "../models/user.js";
import { hashedPassword, comparePassword } from "../utils/hashPassword.js";
const passwordPattern = /^[a-zA-Z0-9]{3,30}$/;
const registerUser = async (req, res, next) => {
  
  //1. validate user input

  const userRegisterSchema = Joi.object({
    username: Joi.string().min(5).max(30).required(),
    name: Joi.string().max(30),
    email: Joi.string.email().required(),
    password: Joi.string.pattern(passwordPattern).required(),
    confirmPassword: Joi.ref("password"),
  });

  const result = userRegisterSchema.validate(req.body);

  //2. if error in validation, return error using middleware

  if (result.error) {
    return next(result.error);
  }

  //3. if email or username is already registered -> return an error

  const { username, name, email, password } = req.body;

  try {
    const emailInUse = await User.exists({ email });
    if (emailInUse) {
      const error = {
        status: 409,
        message: "This email is already registered",
      };
      return next(error);
    }
    const usernameInUse = await User.exists({ username });
    if (usernameInUse) {
      const error = {
        status: 409,
        message: "Username already in use, choose another username",
      };
      return next(error);
    }
  } catch (error) {
    return next(error);
  }
  //4. password hash

  const protectPassword = await hashedPassword(password);

  //5. store user data in database
  const userToRegister = new User({
    username,
    name,
    email,
    protectPassword,
  });
  const user = await userToRegister.save();
  //6. response data
  return res
    .status(200)
    .json({ message: "Data saved successfully in database" }, user);
};

const loginUser = async (req, res, next) => {};

export { registerUser, loginUser };
