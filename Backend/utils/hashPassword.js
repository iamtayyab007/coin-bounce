import bcrypt from "bcrypt";

const hashedPassword = async (password) => {
  hash = await bcrypt.hashSync(password, 10);
  return hash;
};

const comparePassword = async (password) => {
  const compare = await bcrypt.compare(password, hashedPassword);
  return compare;
};

export { hashedPassword, comparePassword };
