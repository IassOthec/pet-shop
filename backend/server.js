import "dotenv/config";
import express from "express";
import cors from "cors";
import petsRoutes from "./routes/pets.routes.js";
import { ensureDatabase, readDatabase } from "./data/db.js";
import { logMiddleware } from "./middleware/log.middleware.js";
import { notFoundHandler } from "./middleware/not-found.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.disable("x-powered-by");

const allowedOrigins = (process.env.CORS_ORIGIN || "*")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.includes("*") ? "*" : allowedOrigins,
  }),
);
app.use(express.json({ limit: "100kb" }));
app.use(logMiddleware);

app.get("/", (req, res) => {
  res.status(200).json({
    name: "PetCare API",
    description: "API REST de gestão de pets do Pet Shop",
    version: "1.0.0",
    documentation: "/api",
    health: "/health",
  });
});

app.get("/api", (req, res) => {
  res.status(200).json({
    message: "API de pets do PetCare",
    persistence: "JSON (backend/data/pets.json)",
    endpoints: [
      { method: "GET", path: "/pets", description: "Lista os pets ativos" },
      {
        method: "GET",
        path: "/pets?includeDeleted=true",
        description: "Lista ativos e arquivados",
      },
      {
        method: "GET",
        path: "/pets/:id",
        description: "Detalhe de um pet ativo",
      },
      { method: "POST", path: "/pets", description: "Cadastra um pet (201)" },
      { method: "PUT", path: "/pets/:id", description: "Atualiza um pet (200)" },
      {
        method: "DELETE",
        path: "/pets/:id",
        description: "Arquiva um pet — soft delete (204)",
      },
      {
        method: "POST",
        path: "/pets/:id/restore",
        description: "Restaura um pet arquivado (200)",
      },
      { method: "GET", path: "/health", description: "Status da API" },
    ],
  });
});

app.get("/health", async (req, res, next) => {
  try {
    const pets = await readDatabase();

    res.status(200).json({
      status: "ok",
      database: "json",
      pets: pets.filter((pet) => !pet.deletedAt).length,
      archived: pets.filter((pet) => pet.deletedAt).length,
      uptime: Number(process.uptime().toFixed(1)),
    });
  } catch (error) {
    next(error);
  }
});

app.use("/pets", petsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const start = async () => {
  await ensureDatabase();

  app.listen(PORT, () => {
    console.log("");
    console.log("  PetCare API");
    console.log(`  http://localhost:${PORT}`);
    console.log(`  http://localhost:${PORT}/api`);
    console.log("  Persistência: backend/data/pets.json");
    console.log("");
  });
};

start().catch((error) => {
  console.error("Falha ao iniciar a API:", error.message);
  process.exit(1);
});
