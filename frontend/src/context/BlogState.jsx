import { useState, useEffect ,useCallback} from "react";
import BlogContext from "./BlogContext";
import axios from "axios";
import { Url } from "../url";
axios.defaults.withCredentials = true;

const BlogState = (props) => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${Url}/posts`);
      setBlogs(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch blogs");
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array means this function won't change

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);


  const addBlog = (newBlog) => {
    setBlogs(prevBlogs => [newBlog, ...prevBlogs]);
  };
  
  // Update blog function
  const updateBlog = (updatedBlog) => {
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) =>
        blog._id === updatedBlog._id ? { ...updatedBlog, likes: updatedBlog.likes || [] } : blog
      )
    );
  };

  
 // Delete blog function
const deleteBlog = async (postId) => {
  setIsLoading(true);
  try {
    const response = await axios.delete(Url + `/posts/${postId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (response.status === 200) {
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== postId));
    }
  } catch (err) {
    setError("An error occurred while deleting the blog.");
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};


 
  return (
    <BlogContext.Provider value={{ blogs, setBlogs, fetchBlogs, updateBlog, deleteBlog,addBlog, error, isLoading }}>
      {props.children}
    </BlogContext.Provider>
  );
};

export default BlogState;
