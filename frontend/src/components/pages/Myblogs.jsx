import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../context/UserContext';
import BlogCard from '../blogs/BlogCard';
import Error from '../common/Error';
import axios from 'axios';
import { Url } from '../../url';
import Loader from '../common/Loader';
import BlogContext from '../../context/BlogContext';
import { PlusCircle } from 'lucide-react';
import { toast } from 'react-toastify';
axios.defaults.withCredentials = true;

const Myblogs = () => {
  const [myblogs, setMyblogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userData } = useContext(UserContext);
  const { blogs } = useContext(BlogContext);
  const navigate = useNavigate();

  const navigateAddBlog = () => {
    navigate('/addblog');
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      if (!userData) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const response = await axios.get(`${Url}/posts/user/${userData._id}`);
        setMyblogs(response.data);
      } catch (error) {
        toast.error("No blogs found!", error.response ? error.response.data : error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, [userData, blogs]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader /></div>;
  }

  if (!userData) {
    return <Error message="Please log in to view your blogs" />;
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 pt-16 sm:pt-20">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-0">My Blogs</h1>
        <button
          onClick={navigateAddBlog}
          className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full flex items-center justify-center transition duration-300 text-sm sm:text-base"
        >
          <PlusCircle className="mr-2" size={16} />
          <span>Add Blog</span>
        </button>
      </div>
      {myblogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {myblogs.map(blog => (
            <BlogCard key={blog._id} blog={blog} isMyBlog={true}/>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 sm:py-8 md:py-12 bg-gray-100 rounded-lg px-2 sm:px-4">
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-3 sm:mb-4">You have not created any blogs yet.</p>
          <button
            onClick={navigateAddBlog}
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 text-sm sm:text-base"
          >
            Create Your First Blog
          </button>
        </div>
      )}
    </div>
  );
};

export default Myblogs;