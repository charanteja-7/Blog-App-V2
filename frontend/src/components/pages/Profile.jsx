import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../context/UserContext';
import axios from 'axios';
import { Url} from '../../url';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const Profile = () => {
  const { userData, setUserData } = useContext(UserContext);
  const [profileImage, setProfileImage] = useState(null);
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) {
      setUserData({ username: "no user found", email: "no user found" });
    } else {
      setBio(userData.bio || "");
    }
  }, [userData, setUserData]);

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };
  const uploadToCloudinary = async(file)=>{
    const data = new FormData();
    data.append("file", file);
    data.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );
    data.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
    data.append("folder", "Cloudinary-React");
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );
      const res = await response.json();
      return res.secure_url;
    } catch (error) {
      console.log(error);  
    }
   }  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('username', userData.username);
    formData.append('email', userData.email);
    formData.append('bio', bio);
    if (profileImage) {
      
        const link =await uploadToCloudinary(profileImage);
        setProfileImage(link);
        formData.append('profileImageUrl', link); 
    }
    if (password && newPassword) {
      formData.append('password', password);
      formData.append('newPassword', newPassword);
    }

    try {
      const response = await axios.put(`${Url}/user/${userData._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      });
   
      
      setUserData(response.data);
      localStorage.setItem('userData', JSON.stringify(response.data));
      toast.success('Profile updated successfully');
      setPassword("");
      setNewPassword("");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await axios.delete(`${Url}/user/${userData._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        });
        toast.success('Account deleted successfully');
        setUserData(null);
        localStorage.removeItem('userData');
        localStorage.removeItem('token');
        localStorage.setItem('isLoggedIn','false' );
        navigate('/');
      } catch (error) {
        console.error("Error deleting account:", error);
        toast.error('Failed to delete account');
      }
    }
  };

  return (
    <div className="max-w-4xl px-4 py-10 sm:px-6 lg:px-8 mx-auto pt-20">
      <div className="bg-white rounded-xl shadow p-4 sm:p-7 dark:bg-neutral-800">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-neutral-200 text-center">
            Profile
          </h1>
          <p className="text-sm text-gray-600 dark:text-neutral-400 text-center">
            Manage your name, password, and account settings.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <label className="w-full sm:w-1/4 text-sm text-gray-800 mb-2 sm:mb-0 dark:text-neutral-200">
                Profile photo
              </label>
              <div className="w-full sm:w-3/4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <img
                    className="inline-block w-16 h-16 rounded-full ring-2 ring-white dark:ring-neutral-900"
                    src={userData.profileImageUrl}
                    alt="Profile Avatar"
                  />
                  <input type="file" accept="image/*" onChange={handleImageChange} className="w-full" />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center">
              <label htmlFor="username" className="w-full sm:w-1/4 text-sm text-gray-800 mb-2 sm:mb-0 dark:text-neutral-200">
                Full name
              </label>
              <input
                id="username"
                type="text"
                className="w-full sm:w-3/4 py-2 px-3 border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400"
                value={userData.username || ""}
                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center">
              <label htmlFor="af-account-email" className="w-full sm:w-1/4 text-sm text-gray-800 mb-2 sm:mb-0 dark:text-neutral-200">
                Email
              </label>
              <input
                id="af-account-email"
                type="email"
                className="w-full sm:w-3/4 py-2 px-3 border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400"
                value={userData.email || "no user found"}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start">
              <label htmlFor="af-account-password" className="w-full sm:w-1/4 text-sm text-gray-800 mb-2 sm:mb-0 dark:text-neutral-200">
                Reset Password
              </label>
              <div className="w-full sm:w-3/4 space-y-2">
                <input
                  id="af-account-password"
                  type="password"
                  className="w-full py-2 px-3 border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400"
                  placeholder="Enter current password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <input
                  type="password"
                  className="w-full py-2 px-3 border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start">
              <label htmlFor="af-account-bio" className="w-full sm:w-1/4 text-sm text-gray-800 mb-2 sm:mb-0 dark:text-neutral-200">
                Bio
              </label>
              <textarea
                id="af-account-bio"
                className="w-full sm:w-3/4 py-2 px-3 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400"
                rows="6"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Type your bio..."
              ></textarea>
            </div>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row justify-end gap-2">
            <button type="button" className="w-full sm:w-auto py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            onClick={() => navigate('/')}>
              Cancel
            </button>
            <button type="button" onClick={handleDeleteAccount} className="w-full sm:w-auto py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:bg-red-700">
              Delete Account
            </button>
            <button type="submit" disabled={loading} className={`w-full sm:w-auto py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent ${loading ? "bg-gray-400" : "bg-blue-600"} text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700`}>
              {loading ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;