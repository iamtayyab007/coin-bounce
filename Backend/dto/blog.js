class BlogDto {
  constructor(blog) {
    this._id = blog._id;
    this.author = blog.author;
    this.content = blog.content;
    this.title = blog.title;
    this.photo = blog.photoPath;
  }
}

export { BlogDto };
