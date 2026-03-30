import { useParams } from "react-router-dom";
import { type Comment } from "../data/content";
import { useEffect, useState } from "react";
import { useBlogContext } from "../context/blogContext";
import BlogComment from "../components/BlogComment";

interface Blog {
  _id: string;
  name: string;
  blogTitle: string;
  blogDescription: string[];
  comments: Comment[];
  likes: number;
}

const BlogPage = () => {
  const { findBlog, loading, error, likeBlog } = useBlogContext();

  const { id } = useParams<{ id: string }>();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [likes, setLikes] = useState<number>(0);
 
  const [formError, setformError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) {
        setformError("No blog ID provided");
        return;
      }
      try {
        const res = await findBlog(id);
        if (!res) {
          setformError("Blog not found");
          return;
        }
        setBlog(res);
        setLikes(res.likes);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setformError(
          err instanceof Error ? err.message : "Failed to fetch blog",
        );
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error || formError) {
    return (
      <div className="container mx-auto p-4 text-red-500">
        {error || formError}
      </div>
    );
  }

  if (!blog) {
    return <div className="container mx-auto p-4">Blog not found</div>;
  }

  const handleLike = async () => {
    if (!id) return;

    try {
      const updatedLikes = await likeBlog(id);

      setLikes(updatedLikes);
    } catch (error) {
      console.error("Error liking blog:", error);
      setformError("Failed to like the blog. Please try again.");
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
              type="button"
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
              {likes} {likes !== 1 ? "Likes" : "Like"}
            </p>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <BlogComment blog={blog.comments} />
    </div>
  );
};

export default BlogPage;
