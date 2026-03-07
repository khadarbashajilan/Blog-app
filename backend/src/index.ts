import express from "express"; // Import the express module
import type { Request, Response } from "express"; // Import Request and Response types from express
import type { Collection, Db } from "mongodb"; // Import Collection and Db types from mongodb
import { MongoClient, ObjectId } from "mongodb"; // Import MongoClient and ObjectId from mongodb
import type { blogsT } from "./populate.ts"; // Import blogsT type from populate.ts

const app = express(); // Create an express application
// This forces your app to use 3000, or whatever the environment variable suggests
const PORT = process.env.PORT || 3000; // Set the port to the environment variable PORT or 3000

const MONGODB_URI = "mongodb://localhost:27017"; // Update with your MongoDB URI
const DB_NAME = "MERN"; // Your database name

// MongoDB connection
let db: Db; // Declare a variable to hold the database connection
let collection: Collection<blogsT>; // Declare a variable to hold the collection
let docs: blogsT[]; // Declare a variable to hold the documents

export async function connectToMongoDB() { // Export an async function to connect to MongoDB
  try { // Start a try block to handle errors
    const client = new MongoClient(MONGODB_URI); // Create a new MongoClient instance
    await client.connect(); // Connect to the MongoDB server
    db = client.db(DB_NAME); // Set the database to the specified DB_NAME
    collection = db.collection("blogs"); // Set the collection to the "blogs" collection
    docs = await collection.find({}).toArray(); // Find all documents in the collection and convert to an array

    console.log(`Connected to MongoDB database: ${DB_NAME}`); // Log a success message
  } catch (error) { // Catch any errors that occur
    console.error("Error connecting to MongoDB:", error); // Log the error
    process.exit(1); // Exit the process with a non-zero status code
  }
}

connectToMongoDB().catch(console.error); // Call the connectToMongoDB function and catch any errors

app.use(express.json()); // Use the express.json middleware to parse JSON bodies

app.get("/", (req: Request, res: Response) => { // Define a GET route for the root path
  res.send("Backend is running with TypeScript!"); // Send a response indicating the backend is running
});

app.post("/api/blogs/:name/like", async (req: Request, res: Response) => { // Define a POST route for liking a blog
  try { // Start a try block to handle errors
    const collection = db.collection("blogs"); // Get the "blogs" collection

    // Find the blog in the database
    const blog = await collection.findOne({ name: req.params.name }); // Find a blog by name

    if (!blog) { // Check if the blog was not found
      return res // Return a response
        .status(404) // Set the status code to 404
        .send(`Blog with name: ${req.params.name} not found`); // Send a message indicating the blog was not found
    }

    const update = { $inc: { likes: 1 } }; // Define the update operation to increment likes by 1

    // Update the blog in the database
    const result = await collection.updateOne( // Update a single document in the collection
      { name: req.params.name }, // Filter to find the document by name
      update, // Update operation
    );

    // Fetch the updated blog to get the latest likes count
    const updatedBlog = await collection.findOne({ name: req.params.name }); // Find the updated blog by name

    res // Send a response
      .status(200) // Set the status code to 200
      .send(`Blog with name: ${req.params.name} has ${blog.likes} likess`); // Send a message with the updated likes count
  } catch (err) { // Catch any errors that occur
    console.error("Error while increasing likes:", err); // Log the error
    res.status(500).send("Internal Server Error"); // Send a 500 Internal Server Error response
  }
});

app.get("/api/blogs", async (req: Request, res: Response) => { // Define a GET route for all blogs
  try { // Start a try block to handle errors
    const docs = await db.collection("blogs").find({}).toArray(); // Find all documents in the "blogs" collection and convert to an array
    res.status(200).json(docs); // Send a JSON response with the documents
  } catch (err) { // Catch any errors that occur
    console.error("Error in home : " + err); // Log the error
  }
});

app.post("/api/blogs/:name/comments", async (req: Request, res: Response) => { // Define a POST route for adding comments to a blog
  try { // Start a try block to handle errors
    const { writtenBy, content } = req.body; // Destructure the writtenBy and content from the request body
    console.log(req.body); // Log the request body

    // Ensure the collection is initialized
    const collection = db.collection("blogs"); // Get the "blogs" collection

    // Find the blog in the database
    const blog = await collection.findOne({ name: req.params.name }); // Find a blog by name

    if (!blog) { // Check if the blog was not found
      return res // Return a response
        .status(404) // Set the status code to 404
        .send(`Blog with name: ${req.params.name} not found`); // Send a message indicating the blog was not found
    }

    // Add the new comment to the blog's comments array
    blog.comments.push({ writtenBy, content }); // Push a new comment to the comments array

    // Update the blog in the database
    const result = await collection.updateOne( // Update a single document in the collection
      { name: req.params.name }, // Filter to find the document by name
      { $set: { comments: blog.comments } }, // Update operation to set the comments array
    );

    // Fetch the updated blog to ensure the latest data
    const updatedBlog = await collection.findOne({ name: req.params.name }); // Find the updated blog by name

    res.status(200).json(updatedBlog); // Send a JSON response with the updated blog
  } catch (err) { // Catch any errors that occur
    console.error("Error while adding comment:", err); // Log the error
    res.status(500).send("Internal Server Error"); // Send a 500 Internal Server Error response
  }
});

app.listen(PORT, "0.0.0.0", () => { // Start the server and listen on the specified port
  console.log(`Server is sprinting on http://localhost:${PORT}`); // Log a message indicating the server is running
});