import React, { useEffect, useState, useRef, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import UserContext from "../../context/UserContext";
import axios from "axios";
import { Url, IF } from "../../url";
import { toast } from "react-toastify";
axios.defaults.withCredentials = true;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { clearUserData, isLoggedIn, userData } = useContext(UserContext);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await axios.get(Url + "/auth/logout");
        localStorage.removeItem('userData');
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');
        clearUserData();
        setIsOpen(false);
        setIsMobileMenuOpen(false);
        toast.success("Logout successful");
        navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
      toast.error("unable to logout");
    }
  };

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
    <nav className="fixed top-0 left-0 right-0 z-50 border-gray-200 bg-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-3">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/124/124022.png"
            className="h-8"
            alt="Blog Logo"
          />
          <p className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white bg-clip-text bg-gradient-to-tr from-blue-600 to-purple-400 text-transparent">
            Blog App
          </p>
        </Link>
        <button
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          onClick={toggleMobileMenu}
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
        </button>

        {isLoggedIn ? (
          <div className="hidden md:block md:order-2">
            <button
              type="button"
              className="overflow-hidden rounded-full border border-gray-300 shadow-inner"
              onClick={toggleMenu}
            >
              <span className="sr-only">Toggle dashboard menu</span>
              <img
                src={
                  userData?.profileImageUrl
                    ? `${IF}/${userData.profileImageUrl}`
                    : "avatar.png"
                }
                alt=""
                className="size-10 object-cover"
              />
            </button>

            {isOpen && (
              <div
                ref={menuRef}
                className="absolute end-0 z-10 mt-0.5 w-56 divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg"
                role="menu"
              >
                <div className="p-2">
                  <Link
                    to="/profile"
                    className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    role="menuitem"
                  >
                    My profile
                  </Link>
                </div>

                <div className="p-2">
                  <form onSubmit={handleLogout}>
                    <button
                      type="submit"
                      className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                      role="menuitem"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                        />
                      </svg>
                      Logout
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="hidden md:inline-block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 md:order-2"
          >
            Sign in
          </Link>
        )}
        <div
          className={`${
            isMobileMenuOpen ? 'block' : 'hidden'
          } w-full md:flex md:w-auto md:order-1`}
          id="navbar-user"
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border bg-transparent md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link
                to="/"
                className={`block py-2 px-3 rounded md:p-0 ${
                  isActiveLink("/") ? "text-blue-700 font-bold" : "text-gray-900"
                } md:dark:text-white md:dark:hover:text-blue-500`}
                aria-current={isActiveLink("/") ? "page" : undefined}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`block py-2 px-3 rounded md:p-0 ${
                  isActiveLink("/about") ? "text-blue-700 font-bold" : "text-gray-900"
                } md:dark:text-white md:dark:hover:text-blue-500`}
                aria-current={isActiveLink("/about") ? "page" : undefined}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/myblogs"
                className={`block py-2 px-3 rounded md:p-0 ${
                  isActiveLink("/myblogs") ? "text-blue-700 font-bold" : "text-gray-900"
                } md:dark:text-white md:dark:hover:text-blue-500`}
                aria-current={isActiveLink("/myblogs") ? "page" : undefined}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Blogs
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={`block py-2 px-3 rounded md:p-0 ${
                  isActiveLink("/contact") ? "text-blue-700 font-bold" : "text-gray-900"
                } md:dark:text-white md:dark:hover:text-blue-500`}
                aria-current={isActiveLink("/contact") ? "page" : undefined}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </li>
            {isLoggedIn ? (
              <>
                <li className="md:hidden">
                  <Link
                    to="/profile"
                    className="block py-2 px-3 rounded text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                </li>
                <li className="md:hidden">
                  <button
                    onClick={(e) => {
                      handleLogout(e);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left block py-2 px-3 rounded text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="md:hidden">
                <Link
                  to="/login"
                  className="block py-2 px-3 rounded text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;