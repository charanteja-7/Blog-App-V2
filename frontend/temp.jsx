import React, { useEffect, useState, useRef, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import UserContext from "../../context/UserContext";
import axios from "axios";
import { Url, IF } from "../../url";
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { clearUserData, isLoggedIn, userData } = useContext(UserContext);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      await axios.get(Url + "/auth/logout");
      clearUserData();
      setIsOpen(false);
      navigate("/", { replace: true }); // Use replace to avoid adding to history
    } catch (error) {
      console.log(error);
    }
  };

  // Function to check if the link is active
  const isActiveLink = (path) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      

<nav class="bg-white border-gray-200 dark:bg-gray-900">
  <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
  <a href="https://flowbite.com/" class="flex items-center space-x-3 rtl:space-x-reverse">
  <img
              src="https://cdn-icons-png.flaticon.com/512/124/124022.png"
              className="h-8"
              alt="Flowbite Logo"
            />
       <p className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white bg-clip-text bg-gradient-to-tr from-blue-600 to-purple-400 text-transparent">
              Blog App
            </p>
  </a>
  <div class="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
      <button type="button" class="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
        <span class="sr-only">Open user menu</span>
        <img class="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-3.jpg" alt="user photo"/>
      </button>
      {/* <!-- Dropdown menu --> */}
      <div class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600" id="user-dropdown">
        <div class="px-4 py-3">
          <span class="block text-sm text-gray-900 dark:text-white">Bonnie Green</span>
          <span class="block text-sm  text-gray-500 truncate dark:text-gray-400">name@flowbite.com</span>
        </div>
        <ul class="py-2" aria-labelledby="user-menu-button">
          <li>
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Dashboard</a>
          </li>
          <li>
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Settings</a>
          </li>
          <li>
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Earnings</a>
          </li>
          <li>
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</a>
          </li>
        </ul>
      </div>
      <button data-collapse-toggle="navbar-user" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-user" aria-expanded="false">
        <span class="sr-only">Open main menu</span>
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
        </svg>
    </button>
  </div>
  <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
    <ul class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
    <li>
                <Link
                  to="/"
                  className={`block py-2 px-3 rounded md:p-0 ${
                    isActiveLink("/")
                      ? "text-blue-700 font-bold"
                      : "text-gray-900"
                  } md:dark:text-white md:dark:hover:text-blue-500`}
                  aria-current={isActiveLink("/") ? "page" : undefined}
                >
                  Home
                </Link>
              </li>
    
      <li>
                <Link
                  to="/about"
                  className={`block py-2 px-3 rounded md:p-0 ${
                    isActiveLink("/about")
                      ? "text-blue-700 font-bold"
                      : "text-gray-900"
                  } md:dark:text-white md:dark:hover:text-blue-500`}
                  aria-current={isActiveLink("/about") ? "page" : undefined}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/myblogs"
                  className={`block py-2 px-3 rounded md:p-0 ${
                    isActiveLink("/myblogs")
                      ? "text-blue-700 font-bold"
                      : "text-gray-900"
                  } md:dark:text-white md:dark:hover:text-blue-500`}
                  aria-current={isActiveLink("/myblogs") ? "page" : undefined}
                >
                  My Blogs
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className={`block py-2 px-3 rounded md:p-0 ${
                    isActiveLink("/contact")
                      ? "text-blue-700 font-bold"
                      : "text-gray-900"
                  } md:dark:text-white md:dark:hover:text-blue-500`}
                  aria-current={isActiveLink("/contact") ? "page" : undefined}
                >
                  Contact
                </Link>
              </li>
    </ul>
  </div>
  </div>
</nav>

    </>
  );
};

export default Navbar;
