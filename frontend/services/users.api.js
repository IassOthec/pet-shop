const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const fetchUsers = async () => {
  const response = await fetch(`${API_URL}/users`);

  if (!response.ok) {
    throw new Error("Falha ao carregar usuários");
  }

  return response.json();
};

export const createUser = async (user) => {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Falha ao cadastrar usuário");
  }

  return response.json();
};
