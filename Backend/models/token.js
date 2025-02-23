import mongoose from "mongoose";

const refreshToken = new mongoose.Schema(
  {
    token: { type: String, required: true },
    userId: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Token = mongoose.model("Token", refreshToken);

export default Token;
