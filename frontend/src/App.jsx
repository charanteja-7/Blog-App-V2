import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./components/pages/Home";
import Myblogs from "./components/pages/Myblogs";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Contact from "./components/pages/Contact";
import About from "./components/pages/About";
import Error from "./components/common/Error";
import Profile from "./components/pages/Profile";
import Addblog from "./components/blogs/Addblog";
import BlogState from "./context/BlogState";
import UserState from "./context/UserState";
import Blog from "./components/blogs/Blog";
import UpdateBlog from "./components/blogs/UpdateBlog";
function App() {
  const location = useLocation();
  const showFooter = !["/login", "/register", "/error"].includes(
    location.pathname
  );
  //to check wheather user is logged in,passing as props
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/myblogs" element={<Myblogs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/error" element={<Error />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/addblog" element={<Addblog />} />
        <Route path="/updateblog/:id" element={<UpdateBlog />} />
        <Route path="/blog/:id" element={<Blog />} />
      </Routes>
      {showFooter && <Footer />}
    </>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <UserState>
        <BlogState>
          <App />
        </BlogState>
      </UserState>
    </Router>
  );
}
