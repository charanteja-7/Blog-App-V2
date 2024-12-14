import React, { useState, useContext } from 'react';
import { Url } from '../../url';
import axios from 'axios';
import UserContext from '../../context/UserContext';
import { toast } from 'react-toastify';
axios.defaults.withCredentials = true;

const Comments = ({ comments, setComments }) => {
  const { userData } = useContext(UserContext);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  
  const handleEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditedComment(comment.comment);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedComment('');
  };

  const handleUpdate = async (commentId) => {
    if (isProcessing || !editedComment.trim()) return;

    try {
      setIsProcessing(true);
      const response = await axios.put(`${Url}/comments/${commentId}`,{
        comment: editedComment.trim(),
        },
        {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data) {
        setComments(prevComments =>
          prevComments.map(comment =>
            comment._id === commentId
              ? { ...comment, comment: editedComment.trim() }
              : comment
          )
        );
        setEditingCommentId(null);
        setEditedComment('');
        toast.success("Comment updated Successfully");
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (isProcessing || !window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      setIsProcessing(true);
      const response = await axios.delete(`${Url}/comments/${commentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 200) {
        setComments(prevComments =>
          prevComments.filter(comment => comment._id !== commentId)
        );
        toast.success("Comment Deleted Successfully");
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div
            key={comment._id}
            className="flex items-start p-4 bg-gray-200 rounded-lg dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <img
              className="w-10 h-10 rounded-full mr-3 object-cover "
              src={comment.userId.profileImageUrl}
              alt={`${comment.author}'s profile`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/path/to/default/profile/image.png';
              }}
            />
            <div className="flex flex-col flex-grow">
              {editingCommentId === comment._id ? (
                <div className="flex flex-col gap-2 w-full">
                  <textarea
                    value={editedComment}
                    onChange={(e) => setEditedComment(e.target.value)}
                    className="w-full p-2 text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    rows="2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(comment._id)}
                      disabled={isProcessing}
                      className="px-3 py-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isProcessing}
                      className="px-3 py-1 text-xs text-gray-600 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {comment.comment}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      - {comment.author} • {new Date(comment.createdAt).toLocaleString()}
                    </p>
                    {userData?._id === comment.userId?._id && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(comment)}
                          disabled={isProcessing}
                          className="text-xs text-blue-500 hover:text-blue-600 disabled:opacity-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(comment._id)}
                          disabled={isProcessing}
                          className="text-xs text-red-500 hover:text-red-600 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No comments yet. Be the first to comment!</p>
      )}
    </div>
  );
};

export default Comments;