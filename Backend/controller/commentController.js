import Joi from "joi";
import Comment from "../models/comment.js";
import { CommentDto } from "../dto/comment.js";

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

const getByIdComment = async (req, res, next) => {
  const getByIdCommentSchema = Joi.object({
    id: Joi.string().regex(mongodbIdPattern).required(),
  });
  const { error } = getByIdCommentSchema.validate(req.params);
  if (error) {
    next(error);
  }
  const { id } = req.params;
  let comments;
  let commentDto = [];
  try {
    comments = await Comment.find({ blog: id }).populate("author");
  } catch (error) {
    return next(error);
  }
  const commentDtos = [];

  for (let i = 0; i < comments.length; i++) {
    let dto = new CommentDto(comments[i]);
    commentDtos.push(dto);
  }
  //const commentDto = comments.map((comment) => new CommentDto(comment));
  //const commentDto = new CommentDto(comments);
  return res.status(200).json({ data: commentDtos });
};

export { createComment, getByIdComment };
