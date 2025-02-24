class CommentDto {
  constructor(comment) {
    this._id = comment._id;
    this.content = comment.content;
    this.createdAt = comment.createdAt;
    this.authorUsername = comment.author.username;
  }
}

export { CommentDto };
