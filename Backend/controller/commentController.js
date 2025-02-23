import Joi from "joi";
import Comment from "../models/comment.js";

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const createComment = async (req, res, next) => {
  const createCommentSchema = Joi.object({
    content: Joi.string().required(),
    author: Joi.string().regex(mongodbIdPattern).required(),
    blog: Joi.string().regex(mongodbIdPattern).required(),
  });
  const { error } = createCommentSchema.validate(req.body);
  if (error) {
    next(error);
  }
  const { content, author, blog } = req.body;
  try {
    const newComment = new Comment({
      content,
      author,
      blog,
    });
    await newComment.save();
  } catch (error) {
    return next(error);
  }
  return res.status(200).json({ message: "comment created successfully" });
};

const getByIdComment = (req, res, next) => {};

export { createComment, getByIdComment };
