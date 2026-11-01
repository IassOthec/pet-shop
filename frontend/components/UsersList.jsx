const UsersList = ({ users, loading, error, onRetry }) => {
  if (loading) {
    return <p className="status">Carregando usuários...</p>;
  }

  if (error) {
    return (
      <div className="status error">
        <p>{error}</p>
        <button type="button" onClick={onRetry}>
          Tentar novamente
        </button>
      </div>
    );
  }

  if (users.length === 0) {
    return <p className="status">Nenhum usuário cadastrado ainda.</p>;
  }

  return (
    <ul className="users-list">
      {users.map((user) => (
        <li key={user.id}>
          <strong>{user.name}</strong>
          <span>{user.email}</span>
        </li>
      ))}
    </ul>
  );
};

export default UsersList;
