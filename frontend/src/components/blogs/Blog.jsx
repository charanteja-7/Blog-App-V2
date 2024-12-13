import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import BlogContext from "../../context/BlogContext";
import UserContext from "../../context/UserContext";
import RelatedMedia from "./RelatedMedia";
import Comments from "../comments/Comments";
import { Url, IF } from "../../url";
import axios from "axios";
import { toast } from "react-toastify";
import parse from "html-react-parser";
import root from 'react-shadow';
axios.defaults.withCredentials = true;

const Blog = () => {
  const { id } = useParams();
  const location = useLocation();
  const { blogs, updateBlog } = useContext(BlogContext);
  const [blog, setBlog] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const { userData } = useContext(UserContext);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isLikeProcessing, setIsLikeProcessing] = useState(false);
  
  const isMyBlog = queryParams.get("ismyblog") === "true";

  useEffect(() => {
    const foundBlog = blogs.find((b) => b._id === id);
    if (foundBlog) {
      setBlog(foundBlog);
      setLikeCount(foundBlog.likes?.length || 0);
      setIsLiked(foundBlog.likes?.includes(userData?._id) || false);
    }
    
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${Url}/comments/post/${id}`);
        if (Array.isArray(response.data)) {
          setComments(response.data);
        } else {
          console.error("Invalid response format for comments:", response.data);
          setComments([]);
        }
      } catch (error) {
        toast.error("Error fetching comments:", error.message);
        setComments([]);
      }
    };
    fetchComments();
  }, [blogs, id]);

  const handleLike = async () => {
    if (isLikeProcessing || !userData?._id) return;

    try {
      setIsLikeProcessing(true);
      const prevLikeCount = likeCount;
      const prevIsLiked = isLiked;

      // Optimistic update
      setLikeCount(prevIsLiked ? prevLikeCount - 1 : prevLikeCount + 1);
      setIsLiked(!prevIsLiked);

      const response = await axios.put(
        `${Url}/posts/${id}/like`,
        { userId: userData._id },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.success) {
       
        const updatedBlog = {
          ...blog,
          likes: response.data.likes || [],
        };
        updateBlog(updatedBlog);
        setBlog(updatedBlog);
        toast.success("Updated Like Status");
      } else {
        // Revert optimistic update on failure
        setLikeCount(prevLikeCount);
        setIsLiked(prevIsLiked);
        toast.error("Unable to update like");
      }
    } catch (error) {
      // Revert optimistic update on error
      setLikeCount(prevLikeCount);
      setIsLiked(prevIsLiked);
      toast.error("Error updating like", error);
    } finally {
      setIsLikeProcessing(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const response = await axios.post(`${Url}/comments`, {
        comment: comment.trim(),
        author: userData.username,
        userId: userData._id,
        postId: id,
      },{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
     
      if (response.data) {
        setComments(prevComments => [...prevComments, response.data]);
        setComment("");
        toast.success("Successfully added comment");
      }
    } catch (error) {
      toast.error("Error adding comment:", error);
    }
  };

    //to display the date
    const formatDate = (dateString) => {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };
  
  if (!blog) return <div>Blog not found</div>;

  //goback route handle
  const backTo = isMyBlog ? "/myblogs" : "/";

  const parsedDescription = parse(blog.description, {
    replace: (domNode) => {
      if (domNode.name === "img") {
        domNode.attribs.style = "max-width: 100%; height: auto; display: block; margin: 0 auto;";
      }
    },
  });

  return (
    <>
    <div className="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto pt-20">
      <div className="grid lg:grid-cols-3 gap-y-8 lg:gap-y-0 lg:gap-x-6">
        {/* <!-- Content --> */}
        <div className="lg:col-span-2">
          <div className="py-8 lg:pe-8">
            <div className="space-y-5 lg:space-y-8">
              <Link
                to={backTo}
                className="inline-flex items-center gap-x-1.5 text-sm text-gray-600 decoration-2 hover:underline focus:outline-none focus:underline dark:text-blue-500"
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
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Back to Blogs
              </Link>

              <h2 className="text-3xl font-bold lg:text-5xl dark:text-white capitalize">
                {blog.title}
              </h2>

              <div className="flex items-center gap-x-5">
                <a
                  className="inline-flex items-center gap-1.5 py-1 px-3 sm:py-2 sm:px-4 rounded-full text-xs sm:text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                  href="#"
                >
                  {blog.category}
                </a>
                <p className="text-xs sm:text-sm text-gray-800 dark:text-neutral-200">
                  {formatDate(blog.createdAt)}
                </p>
              </div>

              <figure className="relative w-full">
                <img
                  className="size-full rounded-xl"
                  src={IF + `/${blog.coverImageURL}`}
                  alt="Blog Image"
                />
              </figure>

          
              {/* {
                parse(blog.description)
              } */}



<root.div className="description">
  {parsedDescription}
</root.div>





              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-y-5 lg:gap-y-0">
                <div className="flex justify-end items-center gap-x-1.5">
                  {/* <!-- Button --> */}

                  <button
                    onClick={handleLike}
                    disabled={isLikeProcessing}
                    type="button"
                    className={`hs-tooltip-toggle flex items-center gap-x-2 text-sm ${
                      isLikeProcessing ? "opacity-50 cursor-not-allowed" : ""
                    } focus:outline-none focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200`}
                  >
                    <svg
                      className="shrink-0 size-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill={isLiked ? "red" : "none"}
                      stroke={isLiked ? "red" : "currentColor"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                    {likeCount}
                  </button>

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
                      {comments.length}
                      <span
                        className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-black tooltip"
                        role="tooltip"
                      >
                        Comment
                      </span>
                    </button>
                  </div>
                  {/* <!-- Button --> */}
                </div>
              </div>
              {/* comments section  */}
              <form
                className=" px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700"
                onSubmit={handleAddComment}
              >
                <label
                  htmlFor="comment"
                  className="font-bold capitalize px-8 text-gray-600"
                >
                  Add Comment
                </label>
                <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <textarea
                    id="comment"
                    rows="1"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter Your Comment here..."
                  ></textarea>
                  <button
                    type="submit"
                    className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
                  >
                    <svg
                      className="w-5 h-5 rotate-90 rtl:-rotate-90"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 18 20"
                    >
                      <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                    </svg>
                    <span className="sr-only">Send message</span>
                  </button>
                </div>
              </form>
              {/* end comments section  */}
              <hr className="h-px  bg-gray-200 border-0 dark:bg-gray-700" />
              {/* display comments  */}
              <div className=" px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                <p>Comments - {comments.length}</p>
                <Comments comments={comments} setComments={setComments} />
              </div>
              {/* display comments  end */}
            </div>
          </div>
        </div>
        {/* <!-- End Content --> */}

        {/* <!-- Sidebar --> */}
        <div className="lg:col-span-1 lg:w-full lg:h-full lg:bg-gradient-to-r lg:from-gray-50 lg:via-transparent lg:to-transparent dark:from-neutral-800">
          <div className="sticky top-0 start-0 py-8 lg:ps-8">
            {/* <!-- Avatar Media --> */}
            <div className="group flex items-center gap-x-3 border-b border-gray-200 pb-8 mb-8 dark:border-neutral-700">
              <a className="block shrink-0 focus:outline-none" href="#">
                <img
                  className="size-12 rounded-full object-cover"
                  src={IF + `/${blog.userId.profileImageUrl}`}
                  alt="Avatar"
                />
              </a>

              <div className="group grow block focus:outline-none">
                <h5 className="group-hover:text-gray-600 group-focus:text-gray-600 text-sm font-semibold text-gray-800 dark:group-hover:text-neutral-400 dark:group-focus:text-neutral-400 dark:text-neutral-200">
                  {blog.userId.username}
                </h5>
                <p className="text-sm text-gray-500 dark:text-neutral-500">
                  {blog.userId.email}
                </p>
              </div>
            </div>
            {/* <!-- End Avatar Media --> */}

            <RelatedMedia
              blogs={blogs}
              currentCategory={blog.category}
              currentBlogId={blog._id}
            />
          </div>
        </div>
        {/* <!-- End Sidebar --> */}
      </div>
    </div>
    </>
  );
};

export default Blog;
