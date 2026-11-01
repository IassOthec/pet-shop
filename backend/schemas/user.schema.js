import { z } from "zod";

export const createUserSchema = z
  .object({
    name: z.string().trim().min(2, "O nome deve ter pelo menos 2 caracteres"),
    email: z.string().trim().email("Informe um e-mail válido"),
  })
  .strict();

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(2, "O nome deve ter pelo menos 2 caracteres").optional(),
    email: z.string().trim().email("Informe um e-mail válido").optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar",
  });
