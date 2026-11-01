import { z } from "zod";

export const SPECIES = ["cao", "gato", "ave", "roedor", "reptil", "outro"];
export const SIZES = ["pequeno", "medio", "grande"];

const PHONE_REGEX = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const emptyToNull = (value) =>
  typeof value === "string" && value.trim() === "" ? null : value;

const name = z
  .string({
    required_error: "Informe o nome do pet",
    invalid_type_error: "O nome deve ser um texto",
  })
  .trim()
  .min(2, "O nome deve ter pelo menos 2 caracteres")
  .max(60, "O nome deve ter no máximo 60 caracteres");

const phone = z
  .string({
    required_error: "Informe o telefone do tutor",
    invalid_type_error: "O telefone deve ser um texto",
  })
  .trim()
  .regex(PHONE_REGEX, "Informe um telefone válido com DDD");

const optionalText = (max, label) =>
  z.preprocess(
    emptyToNull,
    z
      .string()
      .trim()
      .max(max, `${label} deve ter no máximo ${max} caracteres`)
      .nullable()
      .optional(),
  );

const optionalEmail = z.preprocess(
  emptyToNull,
  z
    .string()
    .trim()
    .email("Informe um e-mail válido")
    .max(120, "O e-mail deve ter no máximo 120 caracteres")
    .nullable()
    .optional(),
);

const isValidDate = (value) => {
  if (!DATE_REGEX.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    year >= 1900 &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

const isNotFuture = (value) => {
  if (!isValidDate(value)) {
    return true;
  }

  const now = new Date();
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  return value <= today;
};

const birthDate = z.preprocess(
  emptyToNull,
  z
    .string()
    .trim()
    .regex(DATE_REGEX, "Use uma data no formato AAAA-MM-DD")
    .refine(isValidDate, "Informe uma data válida")
    .refine(isNotFuture, "A data de nascimento não pode estar no futuro")
    .nullable()
    .optional(),
);

const species = z.enum(SPECIES, {
  errorMap: () => ({ message: "Selecione uma espécie válida" }),
});

const size = z.enum(SIZES, {
  errorMap: () => ({ message: "Selecione um porte válido" }),
});

export const tutorSchema = z
  .object({
    name,
    phone,
    email: optionalEmail,
  })
  .strict();

const tutorUpdateSchema = z
  .object({
    name: name.optional(),
    phone: phone.optional(),
    email: optionalEmail,
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um dado do tutor",
  });

export const createPetSchema = z
  .object({
    name,
    species,
    breed: optionalText(60, "A raça"),
    size,
    birthDate,
    tutor: tutorSchema,
    notes: optionalText(500, "As observações"),
  })
  .strict();

export const updatePetSchema = z
  .object({
    name: name.optional(),
    species: species.optional(),
    breed: optionalText(60, "A raça"),
    size: size.optional(),
    birthDate,
    tutor: tutorUpdateSchema.optional(),
    notes: optionalText(500, "As observações"),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar",
  });
