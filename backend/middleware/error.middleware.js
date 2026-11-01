/**
 * Handler de erro centralizado. Toda rota chama next(error) e a resposta
 * de erro nasce em um único lugar.
 */
export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  // JSON malformado enviado no corpo da requisição.
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      message: "JSON inválido no corpo da requisição",
    });
  }

  const status = Number.isInteger(error.status) ? error.status : 500;

  if (status >= 500) {
    console.error(
      `[erro] ${req.method} ${req.originalUrl}`,
      error.stack ?? error.message,
    );
  }

  const body = {
    message:
      status >= 500
        ? "Erro interno do servidor"
        : error.message || "Não foi possível concluir a requisição",
  };

  if (Array.isArray(error.errors) && error.errors.length > 0) {
    body.errors = error.errors;
  }

  res.status(status).json(body);
};
