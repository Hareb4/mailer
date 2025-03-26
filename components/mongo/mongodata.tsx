import Connection from "@/lib/mongodb";
import ConfigModel from "@/types/config";
import mongoose from "mongoose";

export default async function MongoDataPage() {
  // Connect to MongoDB
  await Connection();
  const data = await ConfigModel.find({}).lean();

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
