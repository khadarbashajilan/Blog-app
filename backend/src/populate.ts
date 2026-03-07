import { Collection, MongoClient, type Db } from "mongodb";


let db:Db



interface Comment {
  writtenBy: string;
  content: string;
}

// Define the blogsT type
export interface blogsT {
  name: string;
  comments: Comment[];
  likes: number;
}

// Fill the ex_blogs array with blog objects
export const ex_blogs: blogsT[] = [
  {
    name: "abc",
    comments: [{ writtenBy: "User123", content: "hey, this good man" }],
    likes: 0,
  },
  {
    name: "xyz",
    comments: [
      { writtenBy: "User001", content: "I never red something likes this" },
    ],
    likes: 0,
  },
];

const MONGODB_URI = "mongodb://localhost:27017"; // Update with your MongoDB URI
const DB_NAME = "MERN"; // Your database name
let coll : Collection<blogsT>

async function cnnct(){
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db =  client.db(DB_NAME);    
    coll = db.collection<blogsT>('blogs');
    const res = await coll.insertMany(ex_blogs)
    console.log(res)
}

cnnct()
