import React from 'react';
import { Link } from 'react-router-dom';

export interface Blog {
  id: number;
  blogName: string;
  blogTitle: string;
  blogDescription: string[];
}

interface BlogsListProps {
  blogs: Blog[];
}

const BlogsList: React.FC<BlogsListProps> = ({ blogs }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {blogs.map((blog) => (
        <div key={blog.id} className="bg-white rounded-lg shadow-sm overflow-hidden h-full">
          <div className="p-4">
            <div className="text-xs font-medium text-indigo-600 mb-1">{blog.blogName}</div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">{blog.blogTitle}</h2>
            <div className="text-gray-600 text-sm mb-3">
              {blog.blogDescription[0].substring(0, 100)}...
            </div>
            <Link
              to={`/blogs/${blog.id}`}
              className="bg-indigo-600 text-white text-xs px-3 py-1 rounded hover:bg-indigo-700 transition duration-300 inline-block"
            >
              Read More
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogsList;