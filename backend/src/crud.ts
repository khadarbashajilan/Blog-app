import { MongoClient, ObjectId, Db } from "mongodb";

const MONGODB_URI = "mongodb://localhost:27017"; // Update with your MongoDB URI
const DB_NAME = "MERN"; // Your database name

// MongoDB connection
let db: Db;

// Create a collection
// Accepts a collection name as a string. Creates a new collection in the database with the specified name.
async function createCollection(collectionName: string) {
  try {
    await db.createCollection(collectionName);
    console.log(`Collection ${collectionName} created successfully`);
  } catch (error) {
    console.error(`Error creating collection ${collectionName}:`, error);
    throw error;
  }
}

// Connect to MongoDB
// Connects to the MongoDB database using the provided URI and database name. Returns the database object.
async function connectToMongoDB(): Promise<Db> {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  db = client.db(DB_NAME);
  console.log(`Connected to MongoDB database: ${DB_NAME}`);
  return db; // Return the db object
}

// Insert a new document or documents
// Accepts a collection name and a document or array of documents. Inserts the document(s) into the specified collection.
async function insertDocuments(collectionName: string, document: any) {
  try {
    const collection = db.collection(collectionName);
    let result;

    if (Array.isArray(document)) {
      result = await collection.insertMany(document);
      console.log(`Inserted ${result.insertedCount} documents`);
    } else {
      result = await collection.insertOne(document);
      console.log(`Document inserted with _id: ${result.insertedId}`);
    }
    return result;
  } catch (error) {
    console.error("Error creating document:", error);
    throw error;
  }
}

// Read documents
// Accepts a collection name and an optional query object. Returns an array of documents that match the query.
async function readDocuments(collectionName: string, query: any = {}) {
  try {
    const collection = db.collection(collectionName);
    const documents = await collection.find(query).toArray();
    console.log(`Found ${documents.length} documents`);
    return documents;
  } catch (error) {
    console.error("Error reading documents:", error);
    throw error;
  }
}

// Update a document
// Accepts a collection name, document ID, and update object. Updates the specified document in the collection.
async function updateDocument(collectionName: string, id: string, update: any) {
  try {
    const collection = db.collection(collectionName);
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: update },
    );
    console.log(`Updated ${result.modifiedCount} document(s)`);
    return result;
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
}

// Clear a document or documents
// Accepts a collection name and an optional document ID. Deletes the specified document or all documents in the collection.
async function clearDocuments(collectionName: string, id: string) {
  try {
    const collection = db.collection(collectionName);
    let result;
    if (id) {
      result = await collection.deleteOne({ _id: new ObjectId(id) });
      console.log(`Deleted ${result.deletedCount} document(s)`);
    } else {
      result = await collection.deleteMany({});
      console.log(`Deleted ${result} document(s)`);
    }
    return result;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
}

// Delete a collection
// Accepts a collection name. Deletes the specified collection from the database.
async function deleteCollection(name:string){
  try{
    const collection = db.collection(name)
    await collection.drop()
    console.log(`Deleted collection name : ${name}`)
  }catch(err){
    console.error("Error deleting collection : ", err)
  }
}

// Delete the database
// Deletes the entire database, including all collections and documents.
async function deleteDatabase() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const dbToDrop = client.db(DB_NAME);
    await dbToDrop.dropDatabase();
    console.log(`Database ${DB_NAME} dropped successfully`);
    await client.close();
  } catch (error) {
    console.error("Error dropping database:", error);
  }
}

// Main function to handle asynchronous operations
// Connects to the MongoDB database and provides commented examples of how to use the CRUD functions.
(async () => {
  try {
    await connectToMongoDB();
    // await createCollection('blogs')
    // await insertDocuments('blogs', {})
    // await updateDocument('Blogs', "blogId", "updateData");
    // await clearDocuments('blogs', 'id')
    // await readDocuments('blogs', 'query')
    // await deleteCollection('blogs')
    // await deleteDatabase()
  } catch (error) {
    console.error("Error in main function:", error);
  }
})();