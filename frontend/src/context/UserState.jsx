import { useEffect, useState } from "react";
import UserContext from "./UserContext";
import axios from "axios";
import { Url } from "../url";
import { toast } from "react-toastify";
axios.defaults.withCredentials = true;

const UserState = (props) => {
  const [userData, setUserData] = useState(() => {
    const storedUserData = localStorage.getItem('userData');
    return storedUserData ? JSON.parse(storedUserData) : null;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  useEffect(() => {
    if (!userData && isLoggedIn) {
      fetchUserData();
    }
  }, [userData, isLoggedIn]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(Url + '/auth/refetch');
      if (response.status === 200) {
        setUserData(response.data);
        setIsLoggedIn(true);
        localStorage.setItem('userData', JSON.stringify(response.data));
        localStorage.setItem('isLoggedIn', 'true');
      }
    } catch (error) {
      toast.error("Error fetching user data:", error);
      clearUserData();
    }
  };

  const clearUserData = () => {
    setUserData(null);
    setIsLoggedIn(false);
    localStorage.removeItem('userData');
    localStorage.setItem('isLoggedIn', 'false');
  };

  return (
    <UserContext.Provider value={{ userData, setUserData, isLoggedIn, setIsLoggedIn, clearUserData, fetchUserData }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserState;