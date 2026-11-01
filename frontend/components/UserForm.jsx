import { useState } from "react";

const UserForm = ({ onCreate }) => {
  const [form, setForm] = useState({ name: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await onCreate({
        name: form.name.trim(),
        email: form.email.trim(),
      });
      setForm({ name: "", email: "" });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <label>
        Nome
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nome do usuário"
          minLength={2}
          required
        />
      </label>

      <label>
        E-mail
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="usuario@email.com"
          required
        />
      </label>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? "Cadastrando..." : "Cadastrar usuário"}
      </button>
    </form>
  );
};

export default UserForm;
