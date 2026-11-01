import { Bird, Cat, Dog, PawPrint, Rabbit, Turtle } from "lucide-react";
import { SPECIES_LABELS } from "../utils/format.js";

const ICONS = {
  cao: Dog,
  gato: Cat,
  ave: Bird,
  roedor: Rabbit,
  reptil: Turtle,
  outro: PawPrint,
};

export const SpeciesIcon = ({ species, size = 18, strokeWidth = 1.9 }) => {
  const Icon = ICONS[species] ?? PawPrint;

  return <Icon size={size} strokeWidth={strokeWidth} aria-hidden="true" />;
};

const SpeciesBadge = ({ species }) => (
  <span className={`species-badge species-badge--${species}`}>
    <SpeciesIcon species={species} size={12} strokeWidth={2.1} />
    {SPECIES_LABELS[species] ?? "Outro"}
  </span>
);

export default SpeciesBadge;
