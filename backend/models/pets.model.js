import { randomUUID } from "node:crypto";
import { readDatabase, updateDatabase } from "../data/db.js";

const byNewest = (first, second) =>
  new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime();

const findIndexById = (pets, id) => pets.findIndex((pet) => pet.id === id);

/**
 * Model: única camada que conversa com o "banco" JSON.
 * Não conhece req/res e não decide status HTTP.
 */
export const PetsModel = {
  async listar({ includeDeleted = false } = {}) {
    const pets = await readDatabase();
    const visible = includeDeleted ? pets : pets.filter((pet) => !pet.deletedAt);

    return visible.slice().sort(byNewest);
  },

  async buscarPorId(id) {
    const pets = await readDatabase();
    return pets.find((pet) => pet.id === id) ?? null;
  },

  async criar(data) {
    const now = new Date().toISOString();

    const pet = {
      id: randomUUID(),
      ...data,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    await updateDatabase((pets) => {
      pets.push(pet);
      return pet;
    });

    return pet;
  },

  async atualizar(id, changes) {
    const now = new Date().toISOString();

    return updateDatabase((pets) => {
      const index = findIndexById(pets, id);

      if (index === -1) {
        return null;
      }

      const current = pets[index];
      const updated = {
        ...current,
        ...changes,
        id: current.id,
        createdAt: current.createdAt,
        deletedAt: current.deletedAt,
        updatedAt: now,
      };

      pets[index] = updated;
      return updated;
    });
  },

  async arquivar(id) {
    const now = new Date().toISOString();

    return updateDatabase((pets) => {
      const index = findIndexById(pets, id);

      if (index === -1 || pets[index].deletedAt) {
        return false;
      }

      pets[index] = {
        ...pets[index],
        deletedAt: now,
        updatedAt: now,
      };

      return true;
    });
  },

  async restaurar(id) {
    const now = new Date().toISOString();

    return updateDatabase((pets) => {
      const index = findIndexById(pets, id);

      if (index === -1 || !pets[index].deletedAt) {
        return null;
      }

      const restored = {
        ...pets[index],
        deletedAt: null,
        updatedAt: now,
      };

      pets[index] = restored;
      return restored;
    });
  },
};
