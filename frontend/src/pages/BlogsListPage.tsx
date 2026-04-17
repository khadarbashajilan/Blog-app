import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Blog {
  id: number;
  title: string;
  body: string;
  user_id: number;
}

const BlogsListPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Retrieve the bearer token from local storage
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No token found');
        }

        // Send the GET request to the '/api/blog' endpoint with the bearer token in the headers
        const response = await fetch('/api/blog/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Log the data from the response to the console
        const data: Blog[] = await response.json();
        setBlogs(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleBlogClick = (id: number) => {
    navigate(`/blogs/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 flex items-center justify-center">
        <div className="bg-red-50 text-red-700 border border-red-100 p-4 rounded-lg text-center">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Blogs</h1>
        {blogs.length === 0 ? (
          <p className="text-slate-500">No blogs found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                onClick={() => handleBlogClick(blog.id)}
              >
                <h2 className="text-xl font-bold text-slate-900 mb-2">{blog.title}</h2>
                <p className="text-slate-700 mb-4">{blog.body}</p>
                <div className="flex items-center text-slate-500 text-sm">
                  <span>User ID: {blog.user_id}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsListPage;