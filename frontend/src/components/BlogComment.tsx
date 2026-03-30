import { useEffect, useState } from "react";
import { useBlogContext } from "../context/blogContext";
import type { Comment } from "../data/content";
import { useParams } from "react-router-dom";


interface BlogCommentProps {
  blog: {
    comments: Comment[];
  };
}

const BlogComment: React.FC<BlogCommentProps> = ({ blog }) => {
      const { id } = useParams<{ id: string }>();


    const {addComment} = useBlogContext()

      const [formError, setformError] = useState<string | null>(null);
       const [comments, setComments] = useState<Comment[]>([]);
        const [newComment, setNewComment] = useState<{
          writtenBy: string;
          content: string;
        }>({
          writtenBy: "",
          content: "",
        });
    
    
  const handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear any previous errors
    setformError(null);

    // Client-side validation
    if (!newComment.writtenBy.trim() || !newComment.content.trim()) {
      setformError("Both name and comment fields are required.");
      return;
    }

    if (!id) {
      setformError("No blog ID provided");
      return;
    }
    try {
      const updatedBlog = await addComment(
        id,
        newComment.writtenBy.trim(),
        newComment.content.trim(),
      );

      // Validate the response structure
      if (!updatedBlog) {
        throw new Error("Invalid response from server");
      }
      setComments(updatedBlog.comments);
      setNewComment({ writtenBy: "", content: "" }); // Clear the form
    } catch (error) {
      console.error("Error adding comment:", error);
      // More specific error message based on the error type
      if (error instanceof Error) {
        setformError(
          error.message || "Failed to add comment. Please try again.",
        );
      } else {
        setformError("Failed to add comment. Please try again.");
      }
    }
  };

  useEffect(() => {
    setComments(blog)

  }, [])
  return (
     <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Comments</h2>

          {/* Comment Form */}
    <form onSubmit={handleSubmitComment} className="mb-8">
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-2"
                >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={newComment.writtenBy}
                onChange={(e) =>
                    setNewComment({ ...newComment, writtenBy: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                />
            </div>

            <div className="mb-4">
              <label
                htmlFor="comment"
                className="block text-gray-700 font-medium mb-2"
              >
                Your Comment
              </label>
              <textarea
                id="comment"
                value={newComment.content}
                onChange={(e) =>
                    setNewComment({ ...newComment, content: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700
              transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500
              focus:ring-opacity-50"
              >
              Post Comment
            </button>
          </form>

          {/* Comments List */}
          {comments.length > 0 ? (
              <div className="space-y-6">
              {comments.map((comment, index) => (
                  <div
                  key={index}
                  className="border-b border-gray-200 pb-6 last:border-b-0"
                  >
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      <span className="text-gray-600 font-medium">
                        {comment.writtenBy.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-800">
                      {comment.writtenBy}
                    </h3>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
              <p className="text-gray-600 italic">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      </div>
  )
}

export default BlogComment
