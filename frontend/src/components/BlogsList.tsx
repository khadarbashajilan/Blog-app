import React from 'react';
import { Link } from 'react-router-dom';
import type { blogsT } from './data/content';

interface BlogsListProps {
  blogs: blogsT[];
}


const BlogsList: React.FC<BlogsListProps> = ({ blogs }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {blogs.map((blog) => (
        <div key={blog._id} className="bg-white rounded-lg shadow-sm overflow-hidden h-full">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">{blog.blogTitle}</h2>
            <div className="text-gray-600 text-sm mb-3">
              {blog.blogDescription && blog.blogDescription.length > 0
                ? `${blog.blogDescription[0].substring(0, 100)}...`
                : 'No description available'}...
            </div>
            <Link
              to={`/blogs/${blog._id}`}
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