import Joi from "joi";
import { Buffer } from "buffer";
import fs from "fs";
import Blog from "../models/blog.js";
import Comment from "../models/comment.js";
import { BACKEND_SERVER_PATH } from "../config/index.js";
import { BlogDto } from "../dto/blog.js";
import { BlogDetailsDto } from "../dto/blog-details.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;
const create = async (req, res, next) => {
  //validate req body
  //handle photo storage, naming
  //add to database
  //return response
  //Client side -> base64 encoded string ->decode ->store->save photo's path in database
  const createBlogSchema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().regex(mongodbIdPattern).required(),
    content: Joi.string().required(),
    photoPath: Joi.string().required(),
  });
  const { error } = createBlogSchema.validate(req.body);
  if (error) {
    return next(error);
  }
  const { title, author, content, photoPath } = req.body;
  // this is test comment
  // use buffer for photo reading
  const buffer = Buffer.from(
    photoPath.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
    "base64"
  );
  // allot a random name
  const imagePath = `${Date.now()}-${author}.png`;
  // save the file locally
  try {
    fs.writeFileSync(`storage/${imagePath}`, buffer);
  } catch (error) {
    return next(error);
  }
  // save blog in database
  let newBlog;
  try {
    newBlog = new Blog({
      title,
      author,
      content,
      photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`,
    });
    await newBlog.save();
  } catch (error) {
    return next(error);
  }
  const blogDto = new BlogDto(newBlog);
  res.status(201).json({ blog: blogDto });
};
const getAll = async (req, res, next) => {
  try {
    const blogs = await Blog.find({});
    const blogsDTO = [];
    for (let i = 0; i < blogs.length; i++) {
      const dto = new BlogDto(blogs[i]);
      blogsDTO.push(dto);
    }
    return res.status(200).json({ blogs: blogsDTO });
  } catch (error) {
    return next(error);
  }
};
const getById = async (req, res, next) => {
  // validate id
  // response

  const getByIdSchema = Joi.object({
    id: Joi.string().regex(mongodbIdPattern).required(),
  });
  const { error } = getByIdSchema.validate(req.params);
  if (error) {
    return next(error);
  }
  let blog;
  const { id } = req.params;
  try {
    blog = await Blog.findOne({ _id: id }).populate("author");
  } catch (error) {
    return next(error);
  }
  const blogDto = new BlogDetailsDto(blog);
  return res.status(200).json({ blog: blogDto });
};

const update = async (req, res, next) => {
  {
    /*
  //validate
  const updateBlogSchema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    author: Joi.string().regex(mongodbIdPattern).required(),
    blogId: Joi.string().regex(mongodbIdPattern).required(),
    photo: Joi.string(),
  });

  const { error } = updateBlogSchema.validate(req.body);

  const { title, content, author, blogId, photo } = req.body;

  // delete previous photo
  // save new photo

  let blog;

  try {
    blog = await Blog.findOne({ _id: blogId });
  } catch (error) {
    return next(error);
  }

  if (photo) {
    let previousPhoto = blog.photoPath;

    previousPhoto = previousPhoto.split("/").at(-1);

    // delete photo
    fs.unlinkSync(`storage/${previousPhoto}`);

    // read as buffer
    const buffer = Buffer.from(
      photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
      "base64"
    );

    // allot a random name
    const imagePath = `${Date.now()}-${author}.png`;

    // save locally

    fs.writeFileSync(`storage/${imagePath}`, buffer);

    await Blog.updateOne(
      { _id: blogId },
      {
        title,
        content,
        photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`,
      }
    );
  } else {
    await Blog.updateOne({ _id: blogId }, { title, content });
  }

  return res.status(200).json({ message: "blog updated!" });*/
  }

  // Validate input
  const updateBlogSchema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    author: Joi.string().required(),
    blogId: Joi.string().required(),
    photo: Joi.string().optional(),
  });

  const { error } = updateBlogSchema.validate(req.body);
  if (error) return next(error);

  const { title, content, author, blogId, photo } = req.body;

  try {
    const blog = await Blog.findOne({ _id: blogId });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Handle previous photo deletion
    if (photo) {
      let previousPhoto = blog.photoPath
        ? blog.photoPath.split("/").pop()
        : null;
      if (previousPhoto) {
        const previousPhotoPath = path.join(
          __dirname,
          "storage",
          previousPhoto
        );
        try {
          if (fs.existsSync(previousPhotoPath)) {
            fs.unlinkSync(previousPhotoPath);
          }
        } catch (err) {
          console.error("Error deleting previous photo:", err);
        }
      }

      // Convert base64 image to buffer
      const buffer = Buffer.from(
        photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
        "base64"
      );

      // Create storage directory if it doesn't exist
      // const storageDir = path.join(__dirname, "storage");
      // if (!fs.existsSync(storageDir)) {
      // fs.mkdirSync(storageDir, { recursive: true });
      // }

      // Save new image
      const imagePath = `${Date.now()}-${author}.png`;
      const fullImagePath = path.join("storage/", imagePath);
      try {
        fs.writeFileSync(fullImagePath, buffer);
      } catch (error) {
        return next(error);
      }

      // Update the blog with the new image path
      await Blog.updateOne(
        { _id: blogId },
        {
          title,
          content,
          photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`,
        }
      );
    } else {
      // Update without changing the photo
      await Blog.updateOne(
        { _id: blogId },
        {
          title,
          content,
        }
      );
    }

    return res.status(200).json({ message: "Blog updated successfully" });
  } catch (error) {
    return next(error);
  }
};

const deleteById = async (req, res, next) => {
  const deleteBlogSchema = Joi.object({
    id: Joi.string().regex(mongodbIdPattern).required(),
  });
  const { error } = deleteBlogSchema.validate(req.params);
  if (error) {
    next(error);
  }
  const { id } = req.params;
  try {
    await Blog.deleteOne({ _id: id });
    await Comment.deleteMany({ blog: id });
  } catch (error) {
    return next(error);
  }
  return res.status(200).json({ message: "Blog deleted Successfully" });
};

export { create, getAll, getById, update, deleteById };
