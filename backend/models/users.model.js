import { ObjectId } from "mongodb";
import { getDb } from "../data/db.js";

const collection = () => getDb().collection("users");

const serialize = (document) => {
  if (!document) {
    return null;
  }

  return {
    id: document._id.toString(),
    name: document.name,
    email: document.email,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  };
};

export const UsersModel = {
  async listar() {
    const documents = await collection().find().sort({ createdAt: -1 }).toArray();
    return documents.map(serialize);
  },

  async buscarPorId(id) {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const document = await collection().findOne({ _id: new ObjectId(id) });
    return serialize(document);
  },

  async criar({ name, email }) {
    const document = {
      name,
      email,
      createdAt: new Date(),
    };

    const result = await collection().insertOne(document);

    return serialize({ ...document, _id: result.insertedId });
  },

  async atualizar(id, data) {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const document = await collection().findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: new Date() } },
      { returnDocument: "after" },
    );

    return serialize(document);
  },

  async remover(id) {
    if (!ObjectId.isValid(id)) {
      return false;
    }

    const result = await collection().deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  },
};
