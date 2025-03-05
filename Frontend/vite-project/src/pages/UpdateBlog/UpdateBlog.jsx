import React, { useState, useEffect } from "react";
import { getBlogById, updateBlog } from "../../api/internal";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./UpdateBlog.module.css";
import { useSelector } from "react-redux";
import { TextInput } from "../../components/TextInput/TextInput";

export default function UpdateBlog() {
  const params = useParams();
  const blogId = params.id;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState("");

  const getPhoto = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPhoto(reader.result);
    };
  };

  const author = useSelector((state) => state.user._id);
  const navigate = useNavigate();

  const updateHandler = async (e) => {
    e.preventDefault();
    let data;

    if (photo.includes("http")) {
      data = {
        author,
        title,
        content,
        blogId,
      };
    } else {
      data = {
        author,
        title,
        content,
        photoPath: photo,
        blogId,
      };
    }

    const response = await updateBlog(data);
    console.log(response);
    if (response?.status === 200) {
      navigate("/");
    }
  };

  useEffect(() => {
    async function getBlogDetails() {
      const response = await getBlogById(blogId);
      if (response?.status === 200) {
        setTitle(response.data.blog.title);
        setContent(response.data.blog.content);
        setPhoto(response.data.blog.photo);
      }
    }
    getBlogDetails();
  }, [blogId]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>Edit your blog!</div>
      <TextInput
        type="text"
        name="title"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "60%" }}
      />
      <textarea
        className={styles.content}
        placeholder="your content goes here...."
        maxLength={400}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className={styles.photoPrompt}>
        <p>Choose a photo</p>
        <input
          type="file"
          name="photo"
          id="photo"
          accept="image/jpeg, image/png, image/jpg"
          onChange={getPhoto}
        />
        {photo && <img src={photo} width={40} alt="Blog" />}
      </div>
      <button className={styles.update} onClick={updateHandler}>
        Update
      </button>
    </div>
  );
}
