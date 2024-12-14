import React, { useContext, useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import axios from 'axios';
import { Url } from "../../url";
import { toast } from 'react-toastify';
axios.defaults.withCredentials = true;


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const { setUserData, setIsLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post(Url + "/auth/login", 
            { email, password }
        );
        const user = response.data.userinfo;
        const token = response.data.token;
        localStorage.setItem('userData', JSON.stringify(user));
        localStorage.setItem('token', token);
        localStorage.setItem('isLoggedIn', 'true');
        setUserData(user);
        setIsLoggedIn(true);
        toast.success("Login Successful!");
        navigate("/");

    } catch (err) {
        toast.error(err.response?.data?.message || 'Login failed!');
    }
};


  return (
    <div className="w-full max-w-md mx-auto p-6 pt-20">
      <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Sign in
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
              Don't have an account yet?
              <Link
                to="/register"
                className="text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
              >
                Sign up here
              </Link>
            </p>
          </div>

          <div className="mt-5">
          
           

            {/* <!-- Form --> */}
            <form onSubmit={handleLogin}>
              <div className="grid gap-y-4">
                {/* <!-- Form Group --> */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm mb-2 dark:text-white"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      required
                      aria-describedby="email-error"
                    />
                  </div>
                </div>
                {/* <!-- End Form Group -->

          <!-- Form Group --> */}
                <div>
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="password"
                      className="block text-sm mb-2 dark:text-white"
                    >
                      Password
                    </label>
                    <p to='/'
                      className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
                    >
                      Forgot password?
                    </p>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      required
                      aria-describedby="password-error"
                    />
                  </div>
                  
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
