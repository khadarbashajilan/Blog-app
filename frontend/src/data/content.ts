export interface Comment {
  writtenBy: string;
  content: string;
}

export interface blogsT {
  _id:string
  name: string;
  comments: Comment[];
  likes: number;
  blogTitle: string;
  blogDescription: string[];
}

let blogs: blogsT[] = [];

async function getAll(): Promise<blogsT[]> {
  try {
    const res = await fetch('/api/blogs');
    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

// Call getAll when the module is loaded
async function initializeBlogs() {
  blogs = await getAll();
  // console.log(blogs)
}

// Initialize blogs when the module is loaded
initializeBlogs().catch(console.error);

export { blogs, getAll };