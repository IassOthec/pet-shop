import {
  ChevronRight,
  Menu,
  Plus,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

const Topbar = ({
  onMenu,
  onNewPet,
  query,
  onQueryChange,
  view,
  online,
  loading,
  onRefresh,
}) => {
  const isArchived = view === "archived";

  return (
    <header className="topbar">
      <div className="topbar__left">
        <button
          type="button"
          className="icon-button topbar__menu"
          onClick={onMenu}
          aria-label="Abrir menu"
        >
          <Menu size={19} />
        </button>

        <div className="topbar__crumb">
          <span>Painel</span>
          <ChevronRight size={14} />
          <strong>{isArchived ? "Arquivados" : "Visão geral"}</strong>
        </div>
      </div>

      <div className="topbar__actions">
        <label className="search">
          <Search size={17} />
          <input
            type="text"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={
              isArchived
                ? "Buscar pet ou tutor arquivado..."
                : "Buscar pet, tutor ou telefone..."
            }
            aria-label="Buscar pets"
          />
          {query ? (
            <button
              type="button"
              className="search__clear"
              onClick={() => onQueryChange("")}
              aria-label="Limpar busca"
            >
              <X size={14} />
            </button>
          ) : null}
        </label>

        <span
          className={`api-status ${
            online === true
              ? "is-online"
              : online === false
                ? "is-offline"
                : "is-pending"
          }`}
          title={
            online === true
              ? "A API respondeu à última requisição"
              : online === false
                ? "A API não respondeu à última requisição"
                : "Verificando conexão com a API"
          }
        >
          <span className="api-status__dot" />
          {online === null
            ? "Conectando..."
            : online
              ? "API online"
              : "API offline"}
        </span>

        <button
          type="button"
          className="icon-button topbar__refresh"
          onClick={onRefresh}
          aria-label="Atualizar dados"
          title="Atualizar dados"
          disabled={loading}
        >
          <RefreshCw size={18} className={loading ? "spin" : ""} />
        </button>

        <button
          type="button"
          className="button button--primary topbar__new"
          onClick={onNewPet}
        >
          <Plus size={18} />
          <span>Novo pet</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
