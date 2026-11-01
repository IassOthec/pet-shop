import { Loader2, RotateCcw } from "lucide-react";
import { formatDate, formatPhone } from "../utils/format.js";
import PetAvatar from "./PetAvatar.jsx";
import SpeciesBadge from "./SpeciesBadge.jsx";
import TableSkeleton from "./TableSkeleton.jsx";

const ArchivedList = ({
  pets,
  loading,
  onSelect,
  onRestore,
  restoringId,
}) => {
  if (loading) {
    return <TableSkeleton rows={3} />;
  }

  return (
    <div className="pets-table pets-table--archived" role="table" aria-label="Pets arquivados">
      <div className="pets-table__head" role="row">
        <span role="columnheader">Pet</span>
        <span role="columnheader">Tutor</span>
        <span role="columnheader">Contato</span>
        <span role="columnheader">Arquivado em</span>
        <span role="columnheader" className="align-right">
          Ações
        </span>
      </div>

      {pets.map((pet) => {
        const restoring = restoringId === pet.id;

        return (
          <div
            className="pet-row pet-row--archived"
            role="row"
            key={pet.id}
            tabIndex={0}
            onClick={() => onSelect(pet)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(pet);
              }
            }}
          >
            <div className="pet-cell pet-cell--identity" role="cell">
              <PetAvatar pet={pet} />

              <div className="pet-identity">
                <div className="pet-identity__name">
                  <strong>{pet.name}</strong>
                  <SpeciesBadge species={pet.species} />
                </div>
                <span className="pet-identity__meta">
                  {pet.breed || "Raça não informada"} ·{" "}
                  {pet.tutor.name}
                </span>
              </div>
            </div>

            <div className="pet-cell pet-cell--tutor" role="cell">
              <span className="cell-label">Tutor</span>
              <strong>{pet.tutor.name}</strong>
              <span>{pet.tutor.email || "Sem e-mail cadastrado"}</span>
            </div>

            <div className="pet-cell pet-cell--contact" role="cell">
              <span className="cell-label">Contato</span>
              <span>{formatPhone(pet.tutor.phone)}</span>
            </div>

            <div className="pet-cell pet-cell--date" role="cell">
              <span className="cell-label">Arquivado em</span>
              <span>{formatDate(pet.deletedAt)}</span>
            </div>

            <div
              className="pet-actions"
              role="cell"
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="button button--secondary button--sm"
                onClick={() => onRestore(pet)}
                disabled={restoring}
              >
                {restoring ? (
                  <Loader2 size={15} className="spin" />
                ) : (
                  <RotateCcw size={15} />
                )}
                {restoring ? "Restaurando..." : "Restaurar"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ArchivedList;
