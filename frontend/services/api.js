const BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:3000";

/**
 * Erro padronizado do cliente HTTP (Aula 07).
 * Guarda status e os detalhes de validação devolvidos pela API.
 */
export class ApiError extends Error {
  constructor(status, statusText, message, details = []) {
    super(message || `${status} ${statusText}` || "Falha na requisição");
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.details = details;
  }
}

/**
 * Único lugar do frontend que conhece a URL da API e o fetch.
 * GET, POST, PUT e DELETE passam por aqui.
 */
async function requisicao(caminho, opcoes = {}) {
  const { body, headers, ...rest } = opcoes;

  const configuracoes = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    },
    ...rest,
  };

  if (body !== undefined) {
    configuracoes.body = JSON.stringify(body);
  }

  let response;

  try {
    response = await fetch(`${BASE_URL}${caminho}`, configuracoes);
  } catch {
    throw new ApiError(
      0,
      "Network Error",
      "Não foi possível conectar à API. Verifique se o servidor está rodando.",
    );
  }

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      response.status,
      response.statusText,
      data?.message,
      data?.errors,
    );
  }

  return data;
}

export const apiGet = (caminho, opcoes) =>
  requisicao(caminho, { ...opcoes, method: "GET" });

export const apiPost = (caminho, body, opcoes) =>
  requisicao(caminho, { ...opcoes, method: "POST", body });

export const apiPut = (caminho, body, opcoes) =>
  requisicao(caminho, { ...opcoes, method: "PUT", body });

export const apiDelete = (caminho, opcoes) =>
  requisicao(caminho, { ...opcoes, method: "DELETE" });

export { BASE_URL };
