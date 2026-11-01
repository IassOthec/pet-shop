import {
  Archive,
  Info,
  LayoutDashboard,
  PawPrint,
  ShieldCheck,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "pets", label: "Visão geral", icon: LayoutDashboard },
  { id: "archived", label: "Arquivados", icon: Archive },
];

const Sidebar = ({
  view,
  onNavigate,
  archivedCount,
  open,
  onClose,
  onAbout,
}) => (
  <>
    <aside
      className={`sidebar ${open ? "is-open" : ""}`}
      aria-label="Navegação principal"
    >
      <div className="sidebar__brand">
        <span className="brand-mark">
          <PawPrint size={22} />
        </span>
        <div className="brand-text">
          <strong>PetCare</strong>
          <span>Gestão Pet Shop</span>
        </div>
        <button
          type="button"
          className="icon-button sidebar__close"
          onClick={onClose}
          aria-label="Fechar menu"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="sidebar__nav">
        <span className="sidebar__label">Painel</span>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${view === item.id ? "is-active" : ""}`}
              onClick={() => {
                onNavigate(item.id);
                onClose();
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {item.id === "archived" && archivedCount > 0 ? (
                <span className="nav-item__badge">{archivedCount}</span>
              ) : null}
            </button>
          );
        })}
      </nav>

      <div className="sidebar__project">
        <span className="sidebar__project-head">
          <span className="status-dot" />
          Projeto parcial
        </span>
        <strong>PTAS3 · Semana 10</strong>
        <p>CRUD REST em camadas, validação com zod e soft delete.</p>

        <div className="stack-chips">
          <span>Express</span>
          <span>Zod</span>
          <span>React</span>
        </div>

        <button type="button" className="sidebar__about" onClick={onAbout}>
          <Info size={15} />
          Sobre o projeto
        </button>
      </div>

      <div className="sidebar__footer">
        <ShieldCheck size={15} />
        <span>Dados versionados em JSON</span>
      </div>
    </aside>

    {open ? (
      <button
        type="button"
        className="sidebar-scrim"
        aria-label="Fechar menu"
        onClick={onClose}
      />
    ) : null}
  </>
);

export default Sidebar;
