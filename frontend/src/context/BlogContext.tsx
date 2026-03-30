import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { blogsT } from "../data/content";

// Define the shape of the context
interface BlogContextType {
  blogs: blogsT[];
  loading: boolean;
  error: string | null;
  fetchBlogs: () => Promise<void>;
  likeBlog: (id: string) => number;
  addComment: (id: string, writtenBy: string, content: string) => blogsT;
  findBlog: (id: string) => blogsT;
}

// Create the context with a default value
const BlogContext = createContext<BlogContextType | undefined>(undefined);

// Define the props for the provider component
interface BlogProviderProps {
  children: ReactNode;
}

// Create the provider component
export const BlogProvider: React.FC<BlogProviderProps> = ({ children }) => {
  const [blogs, setBlogs] = useState<blogsT[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/blogs");
      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }
      const data = await response.json();
      setBlogs(data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  const likeBlog = async (id: string) => {

    setError(null);
    try {
      const response = await fetch(`/api/blogs/${id}/like`, {
        method: "PATCH",
      });
      if (!response.ok) {
        throw new Error("Failed to like blog");
      }
      const updatedlikes = await response.json()

      return updatedlikes;
    } catch (err) {
      console.error("Error liking blog:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } 
  };

  const addComment = async (id: string, writtenBy: string, content: string) => {

    setError(null);
    try {
      const response = await fetch(`/api/blogs/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ writtenBy, content }),
      });
      if (!response.ok) {
        throw new Error("Failed to add comment");
      }
      const updatedBlog = await response.json();
      return updatedBlog;
    } catch (err) {
      console.error("Error adding comment:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } 
  };

  const findBlog = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/blogs/${id}`);
      if (!response.ok) {
        throw new Error("Failed to find a blog");
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error Find a Blog : ", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Create a value object to pass to the provider
  const contextValue = useMemo(
    () => ({
      blogs,
      loading,
      error,
      fetchBlogs,
      likeBlog,
      addComment,
      findBlog,
    }),
    [blogs, loading, error],
  ); // Add dependencies here

  return (
    <BlogContext.Provider value={contextValue}>{children}</BlogContext.Provider>
  );
};

// Create the custom hook
export const useBlogContext = () => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error("useBlogContext must be used within a BlogProvider");
  }
  return context;
};
