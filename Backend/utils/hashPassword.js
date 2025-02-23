import bcrypt from "bcryptjs";

const hashedPassword = async (password) => {
  return await bcrypt.hashSync(password, 10);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export { hashedPassword, comparePassword };
