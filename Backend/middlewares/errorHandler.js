import { ValidationError } from "joi";
const errorHandler = (error, req, res, next) => {
  // default Error
  let status = 501;

  const data = {
    message: "Internal server error",
  };

  if (error instanceof ValidationError) {
    status = 401;
    data.message = error.message;
    return res.status(status).json(data);
  }
  if (error.status) {
    status = error.status;
  }
  if (error.message) {
    data.message = error.message;
  }
  return res.status(status).json(data);
};
export { errorHandler };
