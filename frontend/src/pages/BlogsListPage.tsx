import React, { useEffect, useState } from 'react';
import BlogsList from '../BlogsList';
import { getAll, type blogsT } from '../data/content';

const BlogsListPage: React.FC = () => {
  const [allblogs, setblogs] = useState<blogsT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getAll();
        setblogs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <div className="container mx-auto p-4">Loading blogs...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Blogs</h1>
      <BlogsList blogs={allblogs} />
    </div>
  );
};

export default BlogsListPage;