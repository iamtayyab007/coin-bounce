import * as yup from "yup";
const passwordPattern = /^[a-zA-Z0-9]{3,30}$/;
const errorMessage = "use lowercase, uppercase and digits";
const signupSchema = yup.object().shape({
  name: yup.string().max(30).required("name is required"),
  username: yup.string().min(5).max(30).required("username is required"),
  email: yup
    .string()
    .email("enter a valid email")
    .required("email is required"),
  password: yup
    .string()
    .min(8)
    .max(25)
    .matches(passwordPattern, { message: errorMessage })
    .required("password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Password must match")
    .required("confirmPassword is required"),
});

export default signupSchema;
