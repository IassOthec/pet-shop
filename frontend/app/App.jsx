import UsersList from "../components/UsersList.jsx";
import UserForm from "../components/UserForm.jsx";
import { useUsers } from "../hooks/useUsers.js";
import { createUser } from "../services/users.api.js";

const App = () => {
  const { users, loading, error, loadUsers } = useUsers();

  const handleCreate = async (user) => {
    await createUser(user);
    await loadUsers();
  };

  return (
    <main className="container">
      <header className="page-header">
        <p className="eyebrow">PTAS 05.11</p>
        <h1>Cadastro de Usuários</h1>
        <p>React, fetch, CORS e MongoDB Atlas trabalhando juntos.</p>
      </header>

      <section className="card">
        <h2>Novo usuário</h2>
        <UserForm onCreate={handleCreate} />
      </section>

      <section className="card">
        <div className="section-title">
          <h2>Usuários cadastrados</h2>
          <span>{users.length}</span>
        </div>
        <UsersList
          users={users}
          loading={loading}
          error={error}
          onRetry={loadUsers}
        />
      </section>
    </main>
  );
};

export default App;
