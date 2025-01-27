import Connection from "@/lib/mongodb";
import ConfigModel from "@/types/config";
import mongoose from "mongoose";

export default async function MongoDataPage() {
  // Connect to MongoDB
  await Connection();

  const data = await ConfigModel.find({}).lean();

  // const db = mongoose.connection;
  // const collection = db.collection("configurations");

  // // Fetch data
  // const cursor = collection.find({}); // Returns a cursor
  // const data = await cursor.toArray();

  // // Log data on the server console
  // console.log("Fetched data from MongoDB:", data);

  return (
    <div>
      <h1>Data from MongoDB</h1>
      <ul>
        {data.map((item: any) => (
          <li key={item._id.toString()}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
