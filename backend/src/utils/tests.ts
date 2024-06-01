import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongo: MongoMemoryServer;

const dbConnect = async () => {
  try {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();

    await mongoose.connect(uri);
  } catch (error) {
    console.error(`Failed to connect to MongoDB. Error: ${error}`);
    process.exit(1);
  }
};

const dbDisconnect = async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongo.stop();
  } catch (error) {
    console.error(`Failed to disconnect from MongoDB. Error: ${error}`);
  }
};

export { dbConnect, dbDisconnect };
