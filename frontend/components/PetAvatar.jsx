import { SpeciesIcon } from "./SpeciesBadge.jsx";

const PetAvatar = ({ pet, size = "md" }) => (
  <span
    className={`pet-avatar pet-avatar--${pet.species} pet-avatar--${size}`}
    aria-hidden="true"
  >
    <SpeciesIcon species={pet.species} size={size === "lg" ? 32 : 20} />
  </span>
);

export default PetAvatar;
