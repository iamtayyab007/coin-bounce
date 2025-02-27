class UserDto {
  constructor(user) {
    this._id = user._id;
    this.username = user.username;
    this.email = user.email;
  }
}
export { UserDto };
