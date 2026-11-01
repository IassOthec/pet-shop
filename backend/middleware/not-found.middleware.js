import { HttpError } from "../errors/http-error.js";

/** Qualquer rota não registrada cai aqui e vira um 404 padronizado. */
export const notFoundHandler = (req, res, next) => {
  next(new HttpError(404, `Rota ${req.method} ${req.originalUrl} não encontrada`));
};
