/**
 * Erro com status HTTP. O handler centralizado usa `status` para montar
 * a resposta e `errors` para devolver os detalhes de validação.
 */
export class HttpError extends Error {
  constructor(status, message, errors = []) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.errors = errors;
  }
}
