import mongoose from "mongoose";
const commentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    blog: {
      type: mongoose.Types.ObjectId,
      ref: "blogs",
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
