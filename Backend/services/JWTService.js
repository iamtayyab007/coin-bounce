import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config/index.js";
import Token from "../models/token.js";

class JWTservice {
  // if you dont want to make a new instance of the class to access the object then make the object static

  //sign access token
  static signAccessToken(payload, expiryTime) {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: expiryTime });
  }
  //sign refresh token
  static signRefreshToken(payload, expiryTime) {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: expiryTime });
  }
  //verfiy access token
  static verifyAccessToken(token) {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  }

  //verify refresh token
  static verifyRefreshToken(token) {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  }
  //store refresh token
  static async storeRefreshToken(token, userId) {
    try {
      const newToken = new Token({
        token: token,
        userId: userId,
      });
      // store token in db
      await newToken.save();
    } catch (error) {
      console.log(error);
    }
  }
}

export default JWTservice;
