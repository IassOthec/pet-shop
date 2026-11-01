import { UsersService } from "../services/users.service.js";

export const listar = async (req, res, next) => {
  try {
    const users = await UsersService.listar();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const buscarPorId = async (req, res, next) => {
  try {
    const user = await UsersService.buscarPorId(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const criar = async (req, res, next) => {
  try {
    const user = await UsersService.criar(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const atualizar = async (req, res, next) => {
  try {
    const user = await UsersService.atualizar(req.params.id, req.body);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const remover = async (req, res, next) => {
  try {
    const removed = await UsersService.remover(req.params.id);

    if (!removed) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
