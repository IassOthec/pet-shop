import { apiDelete, apiGet, apiPost, apiPut } from "./api.js";

export const listarPets = ({ includeDeleted = false } = {}) =>
  apiGet(`/pets${includeDeleted ? "?includeDeleted=true" : ""}`);

export const buscarPet = (id) => apiGet(`/pets/${encodeURIComponent(id)}`);

export const criarPet = (dados) => apiPost("/pets", dados);

export const atualizarPet = (id, dados) =>
  apiPut(`/pets/${encodeURIComponent(id)}`, dados);

export const excluirPet = (id) =>
  apiDelete(`/pets/${encodeURIComponent(id)}`);

export const restaurarPet = (id) =>
  apiPost(`/pets/${encodeURIComponent(id)}/restore`);
