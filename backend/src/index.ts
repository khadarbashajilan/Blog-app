import express from "express";
import type { Request, Response } from "express";
import type { Collection, Db } from "mongodb";
import { MongoClient } from "mongodb";
import type { blogsT } from "./populate.ts";

const app = express();

const PORT = parseInt(process.env.PORT || "3000", 10);

const MONGODB_URI = "mongodb://localhost:27017";
const DB_NAME = "MERN";

// MongoDB connection
let db: Db;
let collection: Collection<blogsT>;
let docs: blogsT[];

export async function connectToMongoDB() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    collection = db.collection("blogs");
    docs = await collection.find({}).toArray();

    console.log(`Connected to MongoDB database: ${DB_NAME}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

// Call connectToMongoDB when the module is loaded
connectToMongoDB().catch((err) => {
  console.error("Failed to connect to MongoDB:", err);
  process.exit(1);
});


app.use(express.json());

// Add CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.get("/", (req: Request, res: Response) => {
  console.log("Root route accessed from host:", req.headers.host);
  res.send("Backend is running with TypeScript!");
});
app.patch("/api/blogs/:name/like", async (req: Request, res: Response) => {
  try {
    const name = req.params.name as string;

    const updated = await collection.findOneAndUpdate(
      { name },
      { $inc: { likes: 1 } }, // Atomically increment the likes count
      { returnDocument: 'after' } // Return the updated document
    );

    if (!updated) {
      return res
        .status(404)
        .send(`Blog with name: ${name} not found`);
    }

    res
      .status(200)
      .json(updated.likes); // Return the updated likes count directly
  } catch (err) {
    console.error("Error while increasing likes:", err);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/api/blogs", async (req: Request, res: Response) => {
  try {
    res.status(200).json(docs);
  } catch (err) {
    console.error("Error in home : " + err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/blogs/:name/comments", async (req: Request, res: Response) => {
  try {
    const { writtenBy , content } = req.body;

    if (!writtenBy || !content) {
     return res
       .status(400)
       .send("Both 'writtenBy' and 'content' fields are required");
   }

    const name = req.params.name as string
    const blog = await collection.findOne({ name });

    if (!blog) {
      return res
        .status(404)
        .send(`Blog with name: ${name} not found`);
    }
    

    blog.comments.push({ writtenBy, content });

    await collection.updateOne(
      { name },
      { $set: { comments: blog.comments } },
    );

    const updatedBlog = await collection.findOne({ name });

    res.status(200).json(updatedBlog);
  } catch (err) {
    console.error("Error while adding comment:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is sprinting on http://localhost:${PORT}`);
  console.log(`Server also accepting connections from any hostname`);
});
