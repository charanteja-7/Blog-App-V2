import React, { useContext, useEffect } from 'react';
import BlogContext from '../../context/BlogContext';
import BlogCard from '../blogs/BlogCard';
import Loader from '../common/Loader';
import { toast } from 'react-toastify';

const Home = () => {
  const { isLoading, blogs, error, fetchBlogs } = useContext(BlogContext);

  useEffect(() => {
    // Fetch blogs when the component mounts
    fetchBlogs();
  }, [fetchBlogs]);

  return (
    <div className='px-4 pt-6 lg:pt-10 pb-12 sm:px-6 lg:px-8 mx-auto'>
      <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
        <h2 className="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white pt-20 bg-clip-text">The Blog</h2>
        <p className="mt-1 text-gray-600 dark:text-neutral-400">Discover a world of ideas through our carefully curated articles that aim to educate and entertain.</p>
      </div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <div className='text-center w-full h-full text-red-500 font-bold'>
          {toast.error(error)?"Be the first one to create a blog":""}
        </div>
      ) : (
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
          {blogs.length === 0 ? (
            <div className='text-center w-full h-full col-span-full text-4xl font-bold'>No Blogs Available</div>
          ) : (
            blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} isMyBlog={false} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Home;