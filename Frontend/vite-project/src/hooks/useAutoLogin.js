import { useState, useEffect } from "react";
import { setUser } from "../store/userSlice";
import { useDispatch } from "react-redux";
import axios from "axios";

function useAutoLogin() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    //IIFFE
    (async function getApiCall() {
      try {
        const response = await axios.get("http://localhost:3000/refresh", {
          withCredentials: true,
        });
        console.log("", response);
        if (response.status === 200) {
          const user = {
            _id: response.data.user._id,
            email: response.data.user.email,
            username: response.data.user.username,
            auth: response.data.auth,
          };
          dispatch(setUser(user));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  return loading;
}

export default useAutoLogin;
