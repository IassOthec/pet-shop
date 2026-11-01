import { HttpError } from "../errors/http-error.js";

/**
 * Transforma um schema zod em middleware.
 * Em caso de erro, delega ao handler centralizado com status 400 e a
 * lista de campos inválidos.
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join(".") || "body",
      message: issue.message,
    }));

    return next(new HttpError(400, "Dados inválidos", errors));
  }

  // Os dados validados (e normalizados pelo zod) seguem para o controller.
  req.body = result.data;
  next();
};
