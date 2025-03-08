import JWTservice from "../services/JWTService.js";
import User from "../models/user.js";
import { UserDto } from "../dto/user.js";

const auth = async (req, res, next) => {
  try {
    //refresh && access token validation

    const { refreshToken, accessToken } = req.cookies;
    if (!refreshToken && !accessToken) {
      const error = {
        status: 401,
        message: "Unauthorized",
      };
      return next(error);
    }
    let _id;
    try {
      _id = JWTservice.verifyAccessToken(accessToken);
    } catch (error) {
      return next(error);
    }
    let user;
    try {
      user = await User.findOne({ _id: _id });
    } catch (error) {
      return next(error);
    }
    const userDto = new UserDto(user);
    req.user = userDto;
    //return res.status(200).json({ user: userDto });
    next();
  } catch (error) {
    return next(error);
  }
};

export { auth };
