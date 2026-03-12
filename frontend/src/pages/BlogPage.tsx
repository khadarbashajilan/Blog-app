import { useParams } from 'react-router-dom';
import { blogs, type Comment } from '../data/content';
import { useEffect, useState } from 'react';

interface Blog {
  _id: string;
  name: string;
  blogTitle: string;
  blogDescription: string[];
  comments: Comment[];
  likes: number;
}

const BlogPage = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [likes, setLikes] = useState<number>(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<{ writtenBy: string, content: string }>({
    writtenBy: '',
    content: ''
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Find the blog when component mounts or id changes
  useEffect(() => {
    if (id) {
      const foundBlog = blogs.find(b => b._id === id);
      if (foundBlog) {
        setBlog(foundBlog);
        setLikes(foundBlog.likes);
        setComments(foundBlog.comments || []);
      } else {
        setError('Blog not found');
      }
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  if (!blog) {
    return <div className="container mx-auto p-4">Blog not found</div>;
  }

  const handleLike = async () => {
    try {
      const res = await fetch(`/api/blogs/${blog.name}/like`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to Inc Like: ${res.status} ${res.statusText}`);
      }

      const updatedLikes = await res.json();
      setLikes(updatedLikes);
    } catch (error) {
      console.error('Error liking blog:', error);
      setError('Failed to like the blog. Please try again.');
    }
  };

 const handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // Clear any previous errors
  setError(null);

  // Client-side validation
  if (!newComment.writtenBy.trim() || !newComment.content.trim()) {
    setError('Both name and comment fields are required.');
    return;
  }

  try {
    const res = await fetch(`/api/blogs/${blog.name}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newComment)
    });

    if (!res.ok) {
      // More specific error handling based on status code
      if (res.status === 404) {
        throw new Error('Blog not found');
      } else if (res.status === 400) {
        throw new Error('Invalid comment data');
      } else {
        throw new Error(`Server error: ${res.status} ${res.statusText}`);
      }
    }

    const updatedBlog = await res.json();

    // // Validate the response structure
    // if (!updatedBlog || !Array.isArray(updatedBlog.comments)) {
    //   throw new Error('Invalid response from server');
    // }

    setComments(updatedBlog.comments);
    setNewComment({ writtenBy: '', content: '' }); // Clear the form
  } catch (error) {
    console.error('Error adding comment:', error);
    // More specific error message based on the error type
    if (error instanceof Error) {
      setError(error.message || 'Failed to add comment. Please try again.');
    } else {
      setError('Failed to add comment. Please try again.');
    }
  }
};

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* Blog Content Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 md:mb-8">
            {blog.blogTitle}
          </h1>

          <div className="prose prose-lg max-w-none text-gray-700 mb-8">
            {blog.blogDescription.map((paragraph, index) => (
              <p key={index} className="mb-4 md:mb-6">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Like Button Section */}
          <div className="flex flex-col items-center space-y-4">
            <button
              className="bg-black text-white rounded-full px-6 py-3 md:px-8 md:py-4
                hover:bg-gray-800 transition-all duration-300 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50
                shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              onClick={handleLike}
              aria-label="Like this blog post"
            >
              <span className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Like</span>
              </span>
            </button>

            <p className="text-gray-600 text-sm md:text-base font-medium">
              {likes} {likes !== 1 ? 'Likes' : 'Like'}
            </p>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Comments</h2>

          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-8">
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={newComment.writtenBy}
                onChange={(e) => setNewComment({...newComment, writtenBy: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="comment" className="block text-gray-700 font-medium mb-2">
                Your Comment
              </label>
              <textarea
                id="comment"
                value={newComment.content}
                onChange={(e) => setNewComment({...newComment, content: e.target.value})}
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
                <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      <span className="text-gray-600 font-medium">
                        {comment.writtenBy.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-800">{comment.writtenBy}</h3>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 italic">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;