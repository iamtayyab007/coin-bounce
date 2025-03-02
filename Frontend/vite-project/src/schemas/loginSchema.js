import * as yup from "yup";
const passwordPattern = /^[a-zA-Z0-9]{3,30}$/;
const errorMessage = "use lowercase, uppercase and digits";

const loginSchema = yup.object().shape({
  username: yup.string().min(5).max(30).required("username is required"),
  password: yup
    .string()
    .min(5)
    .max(25)
    .matches(passwordPattern, { message: errorMessage })
    .required(),
});

export default loginSchema;
