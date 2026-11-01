import { MongoClient } from "mongodb";

let client;
let database;

export const connectDb = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI não configurada no arquivo .env");
  }

  client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
  await client.connect();

  database = client.db(process.env.MONGODB_DB || "ptas3");
  await database.command({ ping: 1 });

  console.log(`MongoDB conectado ao banco ${database.databaseName}`);
  return database;
};

export const getDb = () => {
  if (!database) {
    throw new Error("Banco de dados não conectado");
  }
  return database;
};

export const closeDb = async () => {
  if (client) {
    await client.close();
    client = undefined;
    database = undefined;
  }
};
