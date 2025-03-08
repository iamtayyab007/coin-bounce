import Joi from "joi";
import User from "../models/user.js";
import { hashedPassword, comparePassword } from "../utils/hashPassword.js";
import { UserDto } from "../dto/user.js";
import JWTservice from "../services/JWTService.js";
import Token from "../models/token.js";

const passwordPattern = /^[a-zA-Z0-9]{3,30}$/;

// Register controller
const registerUser = async (req, res, next) => {
  //1. validate user input

  const userRegisterSchema = Joi.object({
    username: Joi.string().min(5).max(30).required(),
    name: Joi.string().max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(passwordPattern).required(),
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
        status: 401,
        message: "This email is already registered",
      };
      return next(error);
    }
    const usernameInUse = await User.exists({ username });
    if (usernameInUse) {
      const error = {
        status: 401,
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

  let accessToken;
  let refreshToken;
  let user;

  try {
    const userToRegister = new User({
      username,
      name,
      email,
      password: protectPassword,
    });
    user = await userToRegister.save();

    // token generation
    accessToken = JWTservice.signAccessToken({ _id: user._id }, "30m");
    refreshToken = JWTservice.signRefreshToken({ _id: user._id }, "60m");
  } catch (error) {
    return next(error);
  }

  // store refreshToken in database
  await JWTservice.storeRefreshToken(refreshToken, user._id);
  // now sending access token and refresh token in cookies

  res.cookie("accessToken", accessToken, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  });

  // now sending refresh token and refresh token in cookies

  res.cookie("refreshToken", refreshToken, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  });

  //6. response data
  const userDtoInstance = new UserDto(user);
  return res.status(201).json({
    message: "Data saved successfully in database",
    user: userDtoInstance,
    auth: true,
  });
};

// Login controller
const loginUser = async (req, res, next) => {
  //1. Validate user input
  const loginRegisterSchema = Joi.object({
    username: Joi.string().min(5).max(30).required(),
    password: Joi.string().pattern(passwordPattern).required(),
  });
  const { error } = loginRegisterSchema.validate();

  //2. if user validation fails, then return error using middleware
  if (error) {
    return next(error);
  }
  //3. match username and password
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    const error = {
      status: 401,
      message: "Invalid username",
    };
    return next(error);
  }
  const matchPassword = await comparePassword(password, user.password);

  if (!matchPassword) {
    const error = {
      status: 401,
      message: "invalid Password",
    };
    return next(error);
  }

  // token generating and sending in cookies
  const accessToken = JWTservice.signAccessToken({ _id: user._id }, "30m");
  const refreshToken = JWTservice.signRefreshToken({ _id: user._id }, "60m");

  // update refresh tokens in database
  try {
    await Token.updateOne(
      {
        _id: user._id,
      },
      {
        token: refreshToken,
      },
      { upsert: true }
    );
  } catch (error) {
    return next(error);
  }
  res.cookie("accessToken", accessToken, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  });

  res.cookie("refreshToken", refreshToken, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  });

  //4.return response
  const userDtoInstance = new UserDto(user);
  res.status(200).json({
    message: "logged in succesfully",
    user: userDtoInstance,
    auth: true,
  });
};

const logoutUser = async (req, res, next) => {
  // delete refreshToken from database
  const { refreshToken } = req.cookies;
  try {
    await Token.deleteOne({ token: refreshToken });
  } catch (error) {
    return next(error);
  }
  //delete cookies
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  // response
  res.status(200).send({ user: null, auth: false });
};

const refresh = async (req, res, next) => {
  // get refresh token from cookies
  // verify refresh token
  // Generate new tokens
  // update database and return response

  const originalRefreshToken = req.cookies.refreshToken;
  let id;
  try {
    id = JWTservice.verifyRefreshToken(originalRefreshToken)._id;
  } catch (e) {
    const error = {
      status: 401,
      message: "Unauthorized",
    };
    return next(error);
  }
  try {
    const match = await Token.findOne({ _id: id, token: originalRefreshToken });
    if (!match) {
      const error = {
        status: 401,
        message: "Unauthorized",
      };
      return next(error);
    }
  } catch (error) {
    return next(error);
  }
  try {
    const accessToken = JWTservice.signAccessToken({ _id: id }, "30m");
    const refreshToken = JWTservice.signRefreshToken({ _id: id }, "60m");

    await Token.updateOne({ _id: id }, { token: refreshToken });
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
  } catch (error) {
    return next(error);
  }
  const user = await User.findOne({ _id: id });
  const userDto = new UserDto(user);
  res.status(200).json({ user: userDto, auth: true });
};

export { registerUser, loginUser, logoutUser, refresh };
