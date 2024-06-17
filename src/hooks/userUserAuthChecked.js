import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { userLoggedIn } from "../features/auth/userAuthSlice";

export const useUserAuthChecked = () => {
  const [userAuth, setUserAuth] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt"); // from localStorage to get JWT

    if (jwt) {
      // if JWT exist, then user logged in
      setUserAuth(true);

      // renew Redux Store
      dispatch(userLoggedIn({ jwt }));
    } else {
      // if no JWT，status false
      setUserAuth(false);;
    }
  }, [dispatch]);

  return userAuth;
};
