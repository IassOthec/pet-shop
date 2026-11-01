import "dotenv/config";
import express from "express";
import cors from "cors";
import usersRoutes from "./routes/users.routes.js";
import { connectDb } from "./data/db.js";
import { logMiddleware } from "./middleware/log.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(logMiddleware);

app.get("/api", (req, res) => {
  res.status(200).json({
    message: "API de usuários",
    endpoints: [
      "GET /users",
      "GET /users/:id",
      "POST /users",
      "PUT /users/:id",
      "DELETE /users/:id",
    ],
  });
});

app.use("/users", usersRoutes);
app.use(errorHandler);

const start = async () => {
  await connectDb();

  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
};

start().catch((error) => {
  console.error("Falha ao iniciar a API:", error.message);
  process.exit(1);
});
