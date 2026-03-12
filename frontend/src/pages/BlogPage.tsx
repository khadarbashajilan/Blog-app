import { useParams } from 'react-router-dom';
import { blogs } from '../data/content';

const BlogPage = () => {
  const {id} = useParams<{id:string}>(); 
  const blog = blogs.find(b => b._id === id)
  console.log(blog)
  if (!blog) {
    return <div className="container mx-auto p-4">Blog not found</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{blog.blogTitle}</h1>
          <div className="text-gray-700 mb-6">
            {blog.blogDescription.map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
      {/*  */}
    </div>
  );
};

export default BlogPage;