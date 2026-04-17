import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Creator {
  name: string;
  mail: string;
}

interface Blog {
  id: number;
  title: string;
  body: string;
  creator: Creator;
}
  
const BlogPage = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        // Retrieve the bearer token from local storage
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No token found');
        }

        // Send the GET request to the '/api/blog/{id}' endpoint with the bearer token in the headers
        const response = await fetch(`/api/blog/${id}`, {
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
        const data: Blog = await response.json();
        setBlog(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

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

  if (!blog) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 flex items-center justify-center">
        <div className="bg-yellow-50 text-yellow-700 border border-yellow-100 p-4 rounded-lg text-center">
          Blog not found.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-4">{blog.title}</h1>
          <p className="text-slate-700 mb-6">{blog.body}</p>
          <div className="flex items-center text-slate-500 text-sm">
            <span>Creator: {blog.creator.name}</span>
          </div>
          <div className="flex items-center text-slate-500 text-sm mt-2">
            <span>Email: {blog.creator.mail}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;