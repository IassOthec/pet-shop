import { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Archive,
  CalendarDays,
  Clock3,
  Loader2,
  Mail,
  PawPrint,
  Pencil,
  Phone,
  RotateCcw,
  Users,
  X,
} from "lucide-react";
import {
  calculateAge,
  formatDate,
  formatDateTime,
  formatPhone,
  initials,
  SIZE_LABELS,
} from "../utils/format.js";
import PetAvatar from "./PetAvatar.jsx";
import SpeciesBadge from "./SpeciesBadge.jsx";

const PetDetailsDrawer = ({
  pet,
  onClose,
  onEdit,
  onArchive,
  onRestore,
  restoring,
}) => {
  useEffect(() => {
    if (!pet) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [pet, onClose]);

  if (!pet) {
    return null;
  }

  const isArchived = Boolean(pet.deletedAt);
  const phoneDigits = pet.tutor.phone.replace(/\D/g, "");

  return createPortal(
    <div
      className="drawer-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pet-drawer-title"
      >
        <header className="drawer__header">
          <div className="drawer__identity">
            <PetAvatar pet={pet} size="lg" />

            <div>
              <span className="eyebrow">Ficha do pet</span>
              <h2 id="pet-drawer-title">{pet.name}</h2>
              <div className="drawer__chips">
                <SpeciesBadge species={pet.species} />
                <span className="meta-chip">
                  Porte {SIZE_LABELS[pet.size] ?? "não informado"}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Fechar ficha"
          >
            <X size={18} />
          </button>
        </header>

        {isArchived ? (
          <div className="drawer__archived">
            <Archive size={16} />
            Arquivado em {formatDateTime(pet.deletedAt)}
          </div>
        ) : null}

        <div className="drawer__body">
          <section className="drawer__section">
            <h3>
              <Users size={16} />
              Tutor responsável
            </h3>

            <div className="tutor-card">
              <span className="tutor-card__avatar">
                {initials(pet.tutor.name)}
              </span>
              <div className="tutor-card__info">
                <strong>{pet.tutor.name}</strong>
                <span>{pet.tutor.email || "E-mail não informado"}</span>
              </div>
            </div>

            <div className="contact-list">
              <a href={`tel:${phoneDigits}`}>
                <span className="contact-list__icon">
                  <Phone size={16} />
                </span>
                <span>
                  <small>Telefone</small>
                  <strong>{formatPhone(pet.tutor.phone)}</strong>
                </span>
              </a>

              {pet.tutor.email ? (
                <a href={`mailto:${pet.tutor.email}`}>
                  <span className="contact-list__icon">
                    <Mail size={16} />
                  </span>
                  <span>
                    <small>E-mail</small>
                    <strong>{pet.tutor.email}</strong>
                  </span>
                </a>
              ) : null}
            </div>
          </section>

          <section className="drawer__section">
            <h3>
              <PawPrint size={16} />
              Sobre o pet
            </h3>

            <div className="detail-grid">
              <div>
                <span>Raça</span>
                <strong>{pet.breed || "Não informada"}</strong>
              </div>
              <div>
                <span>Porte</span>
                <strong>{SIZE_LABELS[pet.size] ?? "Não informado"}</strong>
              </div>
              <div>
                <span>
                  <CalendarDays size={13} /> Nascimento
                </span>
                <strong>{formatDate(pet.birthDate)}</strong>
              </div>
              <div>
                <span>Idade</span>
                <strong>{calculateAge(pet.birthDate)}</strong>
              </div>
            </div>

            {pet.notes ? (
              <div className="detail-notes">
                <span>Observações</span>
                <p>{pet.notes}</p>
              </div>
            ) : null}
          </section>

          <section className="drawer__dates">
            <Clock3 size={14} />
            <span>Cadastrado em {formatDateTime(pet.createdAt)}</span>
            <span>Atualizado em {formatDateTime(pet.updatedAt)}</span>
          </section>
        </div>

        <footer className="drawer__footer">
          <button
            type="button"
            className="button button--ghost"
            onClick={onClose}
          >
            Fechar
          </button>

          {isArchived ? (
            <button
              type="button"
              className="button button--primary"
              onClick={() => onRestore(pet)}
              disabled={restoring}
            >
              {restoring ? (
                <Loader2 size={16} className="spin" />
              ) : (
                <RotateCcw size={16} />
              )}
              {restoring ? "Restaurando..." : "Restaurar pet"}
            </button>
          ) : (
            <>
              <button
                type="button"
                className="button button--secondary"
                onClick={() => onEdit(pet)}
              >
                <Pencil size={16} />
                Editar
              </button>
              <button
                type="button"
                className="button button--danger"
                onClick={() => onArchive(pet)}
              >
                <Archive size={16} />
                Arquivar
              </button>
            </>
          )}
        </footer>
      </aside>
    </div>,
    document.body,
  );
};

export default PetDetailsDrawer;
