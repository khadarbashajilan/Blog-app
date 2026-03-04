import BlogsList from '../BlogsList';
import blogs from '../data/content';

const BlogsListPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Blogs</h1>
      <BlogsList blogs={blogs} />
    </div>
  );
};

export default BlogsListPage;