export const errorHandler = (error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({
    message: error.message || "Erro interno do servidor",
  });
};
