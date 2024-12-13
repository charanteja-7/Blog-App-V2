import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import UserContext from '../../context/UserContext';
import { Url, IF } from '../../url';
import { toast } from "react-toastify";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
axios.defaults.withCredentials = true;


const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    [{ "code-block": true }],
    ["clean"],
  ],
};
const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
  "image",
  "code-block",
];

const UpdateBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technology');
  const [coverImage, setCoverImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const { userData } = useContext(UserContext);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${Url}/posts/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const { title, description, category, coverImageURL } = response.data;

        setTitle(title);
        setDescription(description);
        setCategory(category);
        setImagePreview(coverImageURL ? `${IF}/${coverImageURL}` : '');
      } catch (error) {
        console.error("Error fetching blog details:", error);
        toast.error("Unable to fetch blog details.");
      }
    };

    fetchBlog();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('userId', userData._id);

    if (coverImage) {
      formData.append('coverImage', coverImage);
    }

    try {
      await axios.put(`${Url}/posts/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success("Blog updated successfully");
      navigate('/myblogs');
    } catch (error) {
      console.error("Blog update error:", error.response ? error.response.data : error.message);
      toast.error("Unable to update the blog");
    }
  };

  return (
    <div className="max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto mt-20">
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl shadow dark:bg-neutral-900">
          <div className="pt-0 p-4 sm:pt-0 sm:p-7">
            <div className="space-y-4 sm:space-y-6">
              {/* Blog Title */}
              <div className="space-y-2">
                <label htmlFor="af-submit-app-project-name" className="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
                  Blog Title
                </label>
                <input
                  id="af-submit-app-project-name"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="py-2 px-3 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                  placeholder="Enter Title of the Blog"
                  required
                />
              </div>

              {/* Cover Image */}
              <div className="space-y-2">
                <label htmlFor="af-submit-app-upload-images" className="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
                  Cover image
                </label>
                <label
                  htmlFor="af-submit-app-upload-images"
                  className="group p-4 sm:p-7 block cursor-pointer text-center border-2 border-dashed border-gray-200 rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 dark:border-neutral-700"
                >
                  <input
                    id="af-submit-app-upload-images"
                    name="af-submit-app-upload-images"
                    type="file"
                    className="sr-only"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                  <span className="mt-2 block text-sm text-gray-800 dark:text-neutral-200">
                    Browse your device or{' '}
                    <span className="group-hover:text-blue-700 text-blue-600">
                      drag 'n drop
                    </span>
                  </span>
                </label>
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Selected"
                      className="max-w-full h-auto rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label htmlFor="af-submit-app-category" className="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
                  Category
                </label>
                <select
                  id="af-submit-app-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="py-2 px-3 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                >
                  <option value="Technology">Technology</option>
                  <option value="Life Style">Life Style</option>
                  <option value="Education">Education</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Business">Business</option>
                  <option value="Arts and Culture">Arts and Culture</option>
                  <option value="Society and Politics">Society and Politics</option>
                </select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label htmlFor="af-submit-app-description" className="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
                  Description
                </label>
                <ReactQuill theme="snow" value={description} onChange={setDescription}   modules={modules}
                    formats={formats}/>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-5 flex justify-center gap-x-2">
              <button
                type="submit"
                className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
              >
                Update Blog
              </button>
            </div>

           
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateBlog;