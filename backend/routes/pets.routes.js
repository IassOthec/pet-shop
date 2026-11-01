import { Router } from "express";
import {
  atualizar,
  buscarPorId,
  criar,
  listar,
  remover,
  restaurar,
} from "../controllers/pets.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { createPetSchema, updatePetSchema } from "../schemas/pet.schema.js";

const router = Router();

router.get("/", listar);
router.get("/:id", buscarPorId);
router.post("/", validate(createPetSchema), criar);
router.put("/:id", validate(updatePetSchema), atualizar);
router.delete("/:id", remover);

// Bônus do soft delete: devolve o pet arquivado para a listagem ativa.
router.post("/:id/restore", restaurar);

export default router;
