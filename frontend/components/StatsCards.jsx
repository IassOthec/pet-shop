import { Cat, Dog, PawPrint, Users } from "lucide-react";

const StatsCards = ({ pets }) => {
  const total = pets.length;
  const dogs = pets.filter((pet) => pet.species === "cao").length;
  const cats = pets.filter((pet) => pet.species === "gato").length;
  const tutors = new Set(pets.map((pet) => pet.tutor.phone)).size;

  const percentage = (value) =>
    total === 0 ? "0%" : `${Math.round((value / total) * 100)}%`;

  const cards = [
    {
      label: "Pets ativos",
      value: total,
      detail: "na base do pet shop",
      icon: PawPrint,
      tone: "teal",
    },
    {
      label: "Cães",
      value: dogs,
      detail: `${percentage(dogs)} dos pets ativos`,
      icon: Dog,
      tone: "amber",
    },
    {
      label: "Gatos",
      value: cats,
      detail: `${percentage(cats)} dos pets ativos`,
      icon: Cat,
      tone: "blue",
    },
    {
      label: "Tutores",
      value: tutors,
      detail: "contatos únicos",
      icon: Users,
      tone: "peach",
    },
  ];

  return (
    <section className="stats-grid" aria-label="Resumo do pet shop">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            className={`stat-card stat-card--${card.tone}`}
            key={card.label}
          >
            <div className="stat-card__top">
              <span className="stat-card__label">{card.label}</span>
              <span className="stat-card__icon">
                <Icon size={20} />
              </span>
            </div>
            <strong className="stat-card__value">{card.value}</strong>
            <span className="stat-card__detail">{card.detail}</span>
          </article>
        );
      })}
    </section>
  );
};

export default StatsCards;
