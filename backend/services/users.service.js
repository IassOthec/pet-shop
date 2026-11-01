import { UsersModel } from "../models/users.model.js";

export const UsersService = {
  listar: () => UsersModel.listar(),
  buscarPorId: (id) => UsersModel.buscarPorId(id),
  criar: (data) => UsersModel.criar(data),
  atualizar: (id, data) => UsersModel.atualizar(id, data),
  remover: (id) => UsersModel.remover(id),
};
