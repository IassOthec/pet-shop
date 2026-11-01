import { Archive, Eye, Pencil } from "lucide-react";
import {
  calculateAge,
  formatDate,
  formatPhone,
  SIZE_LABELS,
} from "../utils/format.js";
import PetAvatar from "./PetAvatar.jsx";
import SpeciesBadge from "./SpeciesBadge.jsx";
import TableSkeleton from "./TableSkeleton.jsx";

const PetsTable = ({ pets, loading, onSelect, onEdit, onArchive }) => {
  if (loading) {
    return <TableSkeleton />;
  }

  return (
    <div className="pets-table" role="table" aria-label="Pets cadastrados">
      <div className="pets-table__head" role="row">
        <span role="columnheader">Pet</span>
        <span role="columnheader">Tutor</span>
        <span role="columnheader">Contato</span>
        <span role="columnheader">Cadastro</span>
        <span role="columnheader" className="align-right">
          Ações
        </span>
      </div>

      {pets.map((pet) => (
        <div
          className="pet-row"
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
                {SIZE_LABELS[pet.size] ?? "Porte não informado"} ·{" "}
                {calculateAge(pet.birthDate)}
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
            <span className="cell-label">Cadastro</span>
            <span>{formatDate(pet.createdAt)}</span>
          </div>

          <div
            className="pet-actions"
            role="cell"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="icon-button icon-button--sm"
              onClick={() => onSelect(pet)}
              title={`Ver ficha de ${pet.name}`}
              aria-label={`Ver ficha de ${pet.name}`}
            >
              <Eye size={16} />
            </button>

            <button
              type="button"
              className="icon-button icon-button--sm"
              onClick={() => onEdit(pet)}
              title={`Editar ${pet.name}`}
              aria-label={`Editar ${pet.name}`}
            >
              <Pencil size={16} />
            </button>

            <button
              type="button"
              className="icon-button icon-button--sm icon-button--danger"
              onClick={() => onArchive(pet)}
              title={`Arquivar ${pet.name}`}
              aria-label={`Arquivar ${pet.name}`}
            >
              <Archive size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PetsTable;
