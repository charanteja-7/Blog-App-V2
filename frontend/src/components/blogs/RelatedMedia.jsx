import React from "react";
import { useNavigate } from "react-router-dom";
import { IF } from "../../url";

const RelatedMedia = ({ blogs, currentCategory, currentBlogId }) => {
    const relatedBlogs = blogs
        .filter(blog => blog.category === currentCategory && blog._id !== currentBlogId && blog.coverImageURL)
        .slice(0, 5);
    const navigate = useNavigate();

    const handleShowMedia = (blogId) => {
        navigate(`/blog/${blogId}`);
    };

    return (
        <div className="space-y-6">
            {relatedBlogs.length > 0 ? (
                relatedBlogs.map(blog => (
                    <div
                        key={blog._id}
                        onClick={() => handleShowMedia(blog._id)}
                        className="group flex items-center gap-x-6 focus:outline-none cursor-pointer border-b border-gray-300 dark:border-neutral-600 pb-3"
                    >
                        <div className="grow">
                            <span className="text-sm font-bold text-gray-800 group-hover:text-blue-600 group-focus:text-blue-600 dark:text-neutral-200 dark:group-hover:text-blue-500 dark:group-focus:text-blue-500 capitalize">
                                {blog.title}
                            </span>
                            <p className="text-xs text-gray-500 dark:text-neutral-400">
                                by {blog.userId.username}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-neutral-300 mt-1">
                               Read more about this Article...
                            </p>
                        </div>

                        <div className="shrink-0 relative rounded-lg overflow-hidden size-20">
                            <img
                                className="size-full absolute top-0 start-0 object-cover rounded-lg"
                                src={IF + `/${blog.coverImageURL}`}
                                alt="Blog Image"
                            />
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">No related blogs found.</p>
            )}
        </div>
    );
};

export default RelatedMedia;
