{
  /*import styles from "./Login.module.css";
import React from "react";
import { useState } from "react";
import { TextInput } from "../../components/TextInput/TextInput";
import loginSchema from "../../schemas/loginSchema";
import { useFormik } from "formik";
import { login } from "../../api/internal.js";
import { setUser } from "../../store/userSlice.js";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";

export default function Login() {
  const [error, setError] = useState("");
  const navigate = Navigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    const data = {
      username: values.username,
      password: values.password,
    };
    const response = await login(data);
    if (response.status === 200) {
      //1. setUser
      const user = {
        _id: response.data.user._id,
        email: response.data.user.email,
        username: response.data.user.username,
        auth: response.data.user.auth,
      };
      dispatch(setUser(user));
      //2. redirect -> homepage
      navigate("/");
    } else if (response.code === "ERR_BAD_REQUEST") {
      //display error
      setError(response.response.data.errormessage);
    }
  };
}
const { values, touched, handleBlur, handleChange, errors } = useFormik({
  initialValues: {
    username: "",
    password: "",
  },
  validationSchema: loginSchema,
});
return (
  <div className={styles.loginWrapper}>
    <div className={styles.loginHeader}>Log in to your account</div>
    <TextInput
      type="text"
      value={values.username}
      name="username"
      onBlur={handleBlur}
      onChange={handleChange}
      placeholder="username"
      error={errors.username && touched.username ? 1 : undefined}
      errormessage={errors.username}
    />
    <TextInput
      type="password"
      value={values.password}
      name="password"
      onBlur={handleBlur}
      onChange={handleChange}
      placeholder="password"
      error={errors.password && touched.password ? 1 : undefined}
      errormessage={errors.password}
    />
    <button className={styles.logInButton} onClick={handleLogin}>
      Log In
    </button>
    <span className={styles.spanCustom}>
      Don't have an account?
      <button className={styles.createAccount} onClick={navigate("/signup")}>
        Register
      </button>
    </span>
  </div>
);
*/
}

// updated code
import styles from "./Login.module.css";
import React, { useState } from "react";
import { TextInput } from "../../components/TextInput/TextInput";
import loginSchema from "../../schemas/loginSchema";
import { useFormik } from "formik";
import { login } from "../../api/internal.js";
import { setUser } from "../../store/userSlice.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // ✅ Correct hook

export default function Login() {
  const [error, setError] = useState("");
  const navigate = useNavigate(); // ✅ Corrected
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: loginSchema,
  });

  const { values, touched, handleBlur, handleChange, errors } = formik;

  const handleLogin = async () => {
    const data = {
      username: values.username,
      password: values.password,
    };
    const response = await login(data);
    if (response.status === 200) {
      //1. Set user in Redux store
      const user = {
        _id: response.data.user._id,
        email: response.data.user.email,
        username: response.data.user.username,
        auth: response.data.auth,
      };

      dispatch(setUser(user));
      //2. Redirect to homepage
      navigate("/");
    } else if (response.code === "ERR_BAD_REQUEST") {
      // Display error
      setError(response.response.data.message);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginHeader}>Log in to your account</div>
      <TextInput
        type="text"
        value={values.username}
        name="username"
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder="username"
        error={errors.username && touched.username ? 1 : undefined}
        errormessage={errors.username}
      />
      <TextInput
        type="password"
        value={values.password}
        name="password"
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder="password"
        error={errors.password && touched.password ? 1 : undefined}
        errormessage={errors.password}
      />
      <button
        className={styles.logInButton}
        onClick={handleLogin}
        disabled={
          !values.username ||
          !values.password ||
          errors.username ||
          errors.password
        }
      >
        Log In
      </button>
      <span className={styles.spanCustom}>
        Don't have an account?
        <button
          className={styles.createAccount}
          onClick={() => navigate("/signup")} // ✅ Fixed
        >
          Register
        </button>
      </span>
      {error != "" ? <p className={styles.errorMessage}>{error}</p> : ""}
    </div>
  );
}
