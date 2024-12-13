import React, { useContext, useState} from 'react';
import axios from 'axios';
import UserContext from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { Url } from '../../url';
import BlogContext from '../../context/BlogContext';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EditorToolbar, { modules, formats } from "./EditorToolbar";




const Addblog = () => { 
  const navigate = useNavigate();
  const [title, setTitle]  = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technology');
  const [coverImage, setCoverImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const {userData} = useContext(UserContext);
  const {addBlog} = useContext(BlogContext);
  //navigate to myblogs page
  const handleNavigate = ()=>{
      navigate('/myblogs');
  }

  //handle setting and display image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file); 
      setImagePreview(window.URL.createObjectURL(file));
    }
  };

  //create a new blog post
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
        const response = await axios.post(Url + `/posts`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            withCredentials: true,
        });
        if (response) {
            toast.success("Blog created successfully");
            addBlog(response.data);
            handleNavigate(); 
        }
    } catch (error) {
        console.error("Blog creation error:", error.response ? error.response.data : error.message);
        toast.error("Unable to create the blog");
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
                  value = {title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="py-2 px-3 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
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
                  />
                  <svg
                    className="size-10 mx-auto text-gray-400 dark:text-neutral-600"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z"
                    />
                    <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z" />
                  </svg>
                  <span className="mt-2 block text-sm text-gray-800 dark:text-neutral-200">
                    Browse your device or{' '}
                    <span className="group-hover:text-blue-700 text-blue-600">
                      drag 'n drop
                    </span>
                  </span>
                </label>
                {/* Display the selected image */}
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

              <div className="space-y-2">
                <label htmlFor="af-submit-app-category" className="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
                  Category
                </label>
                <select
                  id="af-submit-app-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="py-2 px-3 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600"
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
                <div className="text-editor">
                <EditorToolbar />
                <ReactQuill
                  theme="snow"
                  value={description} 
                  onChange={setDescription} 
                  placeholder={"Write something awesome..."}
                  modules={modules}
                  formats={formats}
                />
              </div>
               
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-5 flex justify-center gap-x-2">
              <button
                type="submit"
                className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
              >
                Create Blog
              </button>
              
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Addblog;
