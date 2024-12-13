import React, { useContext, useEffect, useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import BlogContext from "../../context/BlogContext";
import axios from "axios";
import { IF,Url } from "../../url";
import { toast } from "react-toastify";
axios.defaults.withCredentials = true;

const BlogCard = ({ blog, isMyBlog }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteBlog } = useContext(BlogContext);
  const [commentCount, setCommentCount] = useState(0);
  const [views, setViews] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch comments
        const commentsResponse = await axios.get(Url + `/comments/post/${blog._id}`);
        if (commentsResponse.status === 200) {
          setCommentCount(commentsResponse.data.length);
        }

        // Fetch views
        const viewsResponse = await axios.get(Url + `/posts/${blog._id}/views`);
        if (viewsResponse.status === 200) {
          setViews(viewsResponse.data.views);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } 
    };

    fetchData();
  }, [blog._id]);
 
  // Increment view count when blog card is clicked
  const incrementViews = async () => {
    try {
      const response = await axios.post(Url + `/posts/${blog._id}/view`);
      if (response.status === 200) {
        setViews(response.data.views);
      }
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
  
    try {
      await deleteBlog(blog._id);
      toast.success("Blog deleted successfully")
    } catch (err) {
      toast.error("Error Deleting Blog")
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    navigate(`/updateblog/${blog._id}`); 
  };
  
  const truncateText = (text, limit) => {
    if (text.length <= limit) return text;
    return text.substring(0, limit) + "...";
  };
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  return (
<div className="group flex flex-col focus:outline-none border-2 rounded-2xl p-2 transition-transform duration-500 ease-in-out hover:scale-105 hover:shadow-md sm:border-transparent sm:hover:border-2 sm:hover:border-gray-200">

      <Link to={`/blog/${blog._id}?ismyblog=${isMyBlog}`}
       onClick={incrementViews}>
        <div className="aspect-w-16 aspect-h-12 overflow-hidden bg-gray-100 rounded-2xl dark:bg-neutral-800">
          <img
            className="group-hover:scale-105 group-focus:scale-105 transition-transform duration-500 ease-in-out object-cover rounded-2xl"
            src={IF+`/${blog.coverImageURL}`}
            alt={blog.title}
          />
        </div>

        <div className="pt-4">
          <h3 className="relative inline-block font-medium text-lg text-black before:absolute before:bottom-0.5 before:start-0 before:-z-[1] before:w-full before:h-1 before:bg-lime-400 before:transition before:origin-left before:scale-x-0 group-hover:before:scale-x-100 dark:text-white uppercase">
            {blog.title}
          </h3>
          <p className="mt-2 text-sm text-blue-600 dark:text-blue-500">
            {formatDate(blog.createdAt)}
          </p>

        
          <div   className="prose" dangerouslySetInnerHTML={{__html : truncateText(blog.description,50)}}/>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="py-1.5 px-3 bg-white text-gray-600 border border-gray-200 text-xs sm:text-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 hover:text-gray-900">
              {blog.category}
            </span>
          </div>
        </div>
      </Link>
      <div className="flex justify-between mt-4">
        <div className="flex justify-start items-center gap-x-1.5 ">
          {/* <!-- Button --> */}
          {isMyBlog && (
            <>
              <div className="hs-tooltip inline-block">
                <button
                  type="button"
                  className="hs-tooltip-toggle flex items-center gap-x-2 text-sm text-rose-500 hover:text-rose-800 focus:outline-none focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
          
              </div>
              {/* <!-- Button --> */}
              <div className="block h-3 border-e border-gray-300 mx-3 dark:border-neutral-600"></div>
              {/* <!-- Button --> */}
              <div className="hs-tooltip inline-block">
                <button
                  type="button"
                  onClick={handleEdit}
                  className="hs-tooltip-toggle flex items-center gap-x-2 text-sm text-gray-500 hover:text-gray-800 focus:outline-none focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                  Edit
                </button>
              </div>
            </>
          )}
          {/* <!-- Button --> */}
        </div>
        <div className="flex justify-end items-center gap-x-1.5">
          {/* <!-- view Button --> */}
          {!isMyBlog && (
          <div className="hs-tooltip inline-block">
            <button
              type="button"
              className="hs-tooltip-toggle flex items-center gap-x-2 text-sm text-gray-500 hover:text-gray-800 focus:outline-none focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              {views}
              <span
                className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-black"
                role="tooltip"
              >
                Views
              </span>
            </button>
          </div>)}
          {/* <!-- Button --> */}
          <div className="block h-3 border-e border-gray-300 mx-3 dark:border-neutral-600"></div>
          {/* <!-- Button --> */}
          <div className="hs-tooltip inline-block">
            <button
              type="button"
              className="hs-tooltip-toggle flex items-center gap-x-2 text-sm text-gray-500 hover:text-gray-800 focus:outline-none focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
            >
              <svg
                className="shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              {blog.likes.length}
              <span
                className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-black"
                role="tooltip"
              >
                Like
              </span>
            </button>
          </div>
          {/* <!-- Button --> */}

          <div className="block h-3 border-e border-gray-300 mx-3 dark:border-neutral-600"></div>

          {/* <!-- Button --> */}
          <div className="hs-tooltip inline-block">
            <button
              type="button"
              className="hs-tooltip-toggle flex items-center gap-x-2 text-sm text-gray-500 hover:text-gray-800 focus:outline-none focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
            >
              <svg
                className="shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
              </svg>
              {commentCount}
              <span
                className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-black"
                role="tooltip"
              >
                Comment
              </span>
            </button>
          </div>
        </div>
        {/* <!-- Button --> */}
      </div>
    </div>
  );
};

export default BlogCard;
