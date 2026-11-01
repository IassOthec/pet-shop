import { PetsModel } from "../models/pets.model.js";

const normalizeTutor = (tutor) => ({
  name: tutor.name,
  phone: tutor.phone,
  email: tutor.email ?? null,
});

const normalizeCreate = (data) => ({
  name: data.name,
  species: data.species,
  breed: data.breed ?? null,
  size: data.size,
  birthDate: data.birthDate ?? null,
  tutor: normalizeTutor(data.tutor),
  notes: data.notes ?? null,
});

/**
 * Service: regras de negócio. O controller não sabe como o pet é
 * persistido e o model não sabe o que é uma requisição HTTP.
 */
export const PetsService = {
  listar: ({ includeDeleted = false } = {}) => PetsModel.listar({ includeDeleted }),

  buscarPorId: async (id) => {
    const pet = await PetsModel.buscarPorId(id);

    if (!pet || pet.deletedAt) {
      return null;
    }

    return pet;
  },

  criar: (data) => PetsModel.criar(normalizeCreate(data)),

  atualizar: async (id, data) => {
    const current = await PetsModel.buscarPorId(id);

    // Pets arquivados não podem ser editados: primeiro restaure.
    if (!current || current.deletedAt) {
      return null;
    }

    const changes = { ...data };

    // O PUT aceita atualização parcial. No tutor, mesclamos os campos
    // enviados com os que já estavam salvos.
    if (data.tutor) {
      changes.tutor = {
        ...current.tutor,
        ...data.tutor,
      };
    }

    return PetsModel.atualizar(id, changes);
  },

  // Soft delete: em vez de apagar o registro, marcamos deletedAt.
  remover: async (id) => {
    const current = await PetsModel.buscarPorId(id);

    if (!current || current.deletedAt) {
      return false;
    }

    return PetsModel.arquivar(id);
  },

  restaurar: async (id) => {
    const current = await PetsModel.buscarPorId(id);

    if (!current || !current.deletedAt) {
      return null;
    }

    return PetsModel.restaurar(id);
  },
};
