import BlogsList from "../components/BlogsList";
import { useBlogContext } from "../context/blogContext";


const BlogsListPage: React.FC = () => {
  const {blogs, loading, error} = useBlogContext()
  // useEffect(() => {
  //   const fetchBlogs = async () => {
  //     try {
  //       const data = await getAll();
  //       setblogs(data);
  //     } catch (err) {
  //       setError(err instanceof Error ? err.message : 'An unknown error occurred');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

    // fetchBlogs();
  // }, []);

  if (loading) {
    return <div className="container mx-auto p-4">Loading blogs...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Blogs</h1>
      <BlogsList blogs={blogs} />
    </div>
  );
};

export default BlogsListPage;