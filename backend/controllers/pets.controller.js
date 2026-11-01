import { HttpError } from "../errors/http-error.js";
import { PetsService } from "../services/pets.service.js";

const petNotFound = () => new HttpError(404, "Pet não encontrado");

export const listar = async (req, res, next) => {
  try {
    const includeDeleted = ["true", "1"].includes(
      String(req.query.includeDeleted ?? "").toLowerCase(),
    );

    const pets = await PetsService.listar({ includeDeleted });
    res.status(200).json(pets);
  } catch (error) {
    next(error);
  }
};

export const buscarPorId = async (req, res, next) => {
  try {
    const pet = await PetsService.buscarPorId(req.params.id);

    if (!pet) {
      throw petNotFound();
    }

    res.status(200).json(pet);
  } catch (error) {
    next(error);
  }
};

export const criar = async (req, res, next) => {
  try {
    const pet = await PetsService.criar(req.body);
    res.status(201).json(pet);
  } catch (error) {
    next(error);
  }
};

export const atualizar = async (req, res, next) => {
  try {
    const pet = await PetsService.atualizar(req.params.id, req.body);

    if (!pet) {
      throw petNotFound();
    }

    res.status(200).json(pet);
  } catch (error) {
    next(error);
  }
};

export const remover = async (req, res, next) => {
  try {
    const removed = await PetsService.remover(req.params.id);

    if (!removed) {
      throw petNotFound();
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const restaurar = async (req, res, next) => {
  try {
    const pet = await PetsService.restaurar(req.params.id);

    if (!pet) {
      throw new HttpError(404, "Pet arquivado não encontrado");
    }

    res.status(200).json(pet);
  } catch (error) {
    next(error);
  }
};
