import { useCallback, useEffect, useState } from "react";
import { ApiError } from "../services/api.js";
import { listarPets } from "../services/pets.api.js";

const friendlyMessage = (error) => {
  if (error instanceof ApiError) {
    if (error.status === 0) {
      return error.message;
    }

    if (error.status >= 500) {
      return "A API encontrou um erro interno. Tente novamente em instantes.";
    }

    return error.message;
  }

  return "Não foi possível carregar os pets.";
};

export const usePets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [online, setOnline] = useState(null);

  const reload = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setLoading(true);
    }

    try {
      const data = await listarPets({ includeDeleted: true });
      setPets(data);
      setError(null);
      setOnline(true);
    } catch (requestError) {
      setError(friendlyMessage(requestError));
      setOnline(false);

      if (!silent) {
        setPets([]);
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { pets, loading, error, online, reload };
};
