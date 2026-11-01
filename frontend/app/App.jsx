import { useMemo, useState } from "react";
import {
  Archive,
  CalendarDays,
  PawPrint,
  Search,
  ShieldCheck,
} from "lucide-react";
import AboutModal from "../components/AboutModal.jsx";
import ArchivedList from "../components/ArchivedList.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import PetDetailsDrawer from "../components/PetDetailsDrawer.jsx";
import PetFormModal from "../components/PetFormModal.jsx";
import PetsTable from "../components/PetsTable.jsx";
import Sidebar from "../components/Sidebar.jsx";
import StatsCards from "../components/StatsCards.jsx";
import TableSkeleton from "../components/TableSkeleton.jsx";
import Toasts from "../components/Toasts.jsx";
import Topbar from "../components/Topbar.jsx";
import { usePets } from "../hooks/usePets.js";
import { useToasts } from "../hooks/useToasts.js";
import {
  atualizarPet,
  criarPet,
  excluirPet,
  restaurarPet,
} from "../services/pets.api.js";
import {
  formatLongDate,
  normalizeText,
  SPECIES_OPTIONS,
} from "../utils/format.js";

const filterPets = (pets, query, speciesFilter) => {
  const term = normalizeText(query);

  return pets.filter((pet) => {
    if (speciesFilter !== "todos" && pet.species !== speciesFilter) {
      return false;
    }

    if (!term) {
      return true;
    }

    const haystack = normalizeText(
      [
        pet.name,
        pet.breed,
        pet.tutor.name,
        pet.tutor.phone,
        pet.tutor.email,
      ]
        .filter(Boolean)
        .join(" "),
    );

    return haystack.includes(term);
  });
};

const App = () => {
  const { pets, loading, error, online, reload } = usePets();
  const { toasts, notify, dismiss } = useToasts();

  const [view, setView] = useState("pets");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("todos");
  const [formState, setFormState] = useState({ open: false, pet: null });
  const [selectedPet, setSelectedPet] = useState(null);
  const [confirmPet, setConfirmPet] = useState(null);
  const [archiving, setArchiving] = useState(false);
  const [restoringId, setRestoringId] = useState(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const isArchivedView = view === "archived";

  const activePets = useMemo(
    () => pets.filter((pet) => !pet.deletedAt),
    [pets],
  );

  const archivedPets = useMemo(
    () => pets.filter((pet) => pet.deletedAt),
    [pets],
  );

  const filteredActive = useMemo(
    () => filterPets(activePets, query, speciesFilter),
    [activePets, query, speciesFilter],
  );

  const filteredArchived = useMemo(
    () => filterPets(archivedPets, query, "todos"),
    [archivedPets, query],
  );

  const speciesCounts = useMemo(
    () =>
      activePets.reduce((counts, pet) => {
        counts[pet.species] = (counts[pet.species] ?? 0) + 1;
        return counts;
      }, {}),
    [activePets],
  );

  const visiblePets = isArchivedView ? filteredArchived : filteredActive;
  const hasFilters =
    query.trim() !== "" || (!isArchivedView && speciesFilter !== "todos");

  const clearFilters = () => {
    setQuery("");
    setSpeciesFilter("todos");
  };

  const handleNavigate = (nextView) => {
    setView(nextView);
    setQuery("");
    setSpeciesFilter("todos");
    setSelectedPet(null);
  };

  const openCreate = () => setFormState({ open: true, pet: null });

  const openEdit = (pet) => {
    setSelectedPet(null);
    setFormState({ open: true, pet });
  };

  const closeForm = () => setFormState({ open: false, pet: null });

  const handleArchiveRequest = (pet) => {
    setSelectedPet(null);
    setConfirmPet(pet);
  };

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      await reload({ silent: true });
    } finally {
      setRefreshing(false);
    }
  };

  const handleSubmit = async (payload) => {
    if (formState.pet) {
      const updated = await atualizarPet(formState.pet.id, payload);
      await reload({ silent: true });
      notify(`Alterações de ${updated.name} salvas com sucesso.`);
      return;
    }

    const created = await criarPet(payload);
    await reload({ silent: true });
    notify(`${created.name} foi cadastrado com sucesso.`);
  };

  const handleConfirmArchive = async () => {
    const petToArchive = confirmPet;

    if (!petToArchive) {
      return;
    }

    setArchiving(true);

    try {
      await excluirPet(petToArchive.id);
      setConfirmPet(null);
      setSelectedPet(null);
      await reload({ silent: true });
      notify(`${petToArchive.name} foi movido para Arquivados.`, "info");
    } catch (archiveError) {
      notify(
        archiveError?.message || "Não foi possível arquivar o pet.",
        "error",
      );
    } finally {
      setArchiving(false);
    }
  };

  const handleRestore = async (pet) => {
    setRestoringId(pet.id);

    try {
      const restored = await restaurarPet(pet.id);
      await reload({ silent: true });
      setSelectedPet(null);
      notify(`${restored.name} voltou para a listagem ativa.`);
    } catch (restoreError) {
      notify(
        restoreError?.message || "Não foi possível restaurar o pet.",
        "error",
      );
    } finally {
      setRestoringId(null);
    }
  };

  const emptyState = hasFilters
    ? {
        icon: Search,
        title: "Nenhum resultado encontrado",
        description:
          "Tente outro nome, telefone ou remova o filtro de espécie para ver todos os pets.",
        actionLabel: "Limpar filtros",
        onAction: clearFilters,
        actionVariant: "secondary",
      }
    : isArchivedView
      ? {
          icon: Archive,
          title: "Nenhum pet arquivado",
          description:
            "Quando um cadastro for arquivado, ele aparece aqui e pode ser restaurado a qualquer momento.",
          actionLabel: "Voltar para visão geral",
          onAction: () => handleNavigate("pets"),
          actionVariant: "secondary",
        }
      : {
          icon: PawPrint,
          title: "Seu pet shop está pronto para o primeiro cadastro",
          description:
            "Cadastre um pet, informe o tutor responsável e comece a organizar os atendimentos do PetCare.",
          actionLabel: "Cadastrar primeiro pet",
          onAction: openCreate,
          actionVariant: "primary",
        };

  return (
    <div className="app-shell">
      <Sidebar
        view={view}
        onNavigate={handleNavigate}
        archivedCount={archivedPets.length}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onAbout={() => {
          setSidebarOpen(false);
          setAboutOpen(true);
        }}
      />

      <div className="app-main">
        <Topbar
          onMenu={() => setSidebarOpen(true)}
          onNewPet={openCreate}
          query={query}
          onQueryChange={setQuery}
          view={view}
          online={online}
          loading={loading || refreshing}
          onRefresh={handleRefresh}
        />

        <main className="page">
          <div className="page-heading">
            <div className="page-heading__text">
              <span className="eyebrow">
                {isArchivedView ? "Arquivo do pet shop" : "Painel do pet shop"}
              </span>
              <h1>{isArchivedView ? "Pets arquivados" : "Visão geral"}</h1>
              <p>
                {isArchivedView
                  ? "Recupere cadastros removidos da listagem ativa ou consulte o histórico do pet shop."
                  : "Acompanhe pets, tutores e contatos do seu pet shop em um só lugar."}
              </p>
            </div>

            <span className="date-chip">
              <CalendarDays size={15} />
              {formatLongDate()}
            </span>
          </div>

          {!isArchivedView ? <StatsCards pets={activePets} /> : null}

          <section className="panel" aria-labelledby="pets-panel-title">
            <div className="panel__header">
              <div className="panel__heading">
                <div className="panel__title-row">
                  <h2 id="pets-panel-title">
                    {isArchivedView ? "Pets arquivados" : "Pets cadastrados"}
                  </h2>
                  <span className="count-pill">
                    {loading ? "…" : visiblePets.length}
                  </span>
                </div>
                <p>
                  {isArchivedView
                    ? "Cadastros preservados no JSON e prontos para restauração."
                    : `${activePets.length} ${
                        activePets.length === 1 ? "pet ativo" : "pets ativos"
                      } · dados persistidos em backend/data/pets.json`}
                </p>
              </div>

              {isArchivedView ? (
                <span className="soft-delete-chip">
                  <ShieldCheck size={14} />
                  Soft delete ativo
                </span>
              ) : (
                <div
                  className="filter-pills"
                  role="group"
                  aria-label="Filtrar por espécie"
                >
                  <button
                    type="button"
                    className={`filter-pill ${
                      speciesFilter === "todos" ? "is-active" : ""
                    }`}
                    onClick={() => setSpeciesFilter("todos")}
                    aria-pressed={speciesFilter === "todos"}
                  >
                    Todos
                    <span>{activePets.length}</span>
                  </button>

                  {SPECIES_OPTIONS.map((option) => {
                    const count = speciesCounts[option.value] ?? 0;

                    return (
                      <button
                        type="button"
                        key={option.value}
                        className={`filter-pill ${
                          speciesFilter === option.value ? "is-active" : ""
                        }`}
                        onClick={() => setSpeciesFilter(option.value)}
                        aria-pressed={speciesFilter === option.value}
                        disabled={
                          count === 0 && speciesFilter !== option.value
                        }
                      >
                        {option.label}
                        <span>{count}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {isArchivedView ? (
              <div className="info-banner">
                <ShieldCheck size={18} />
                <div>
                  <strong>Soft delete</strong>
                  <span>
                    O <code>DELETE</code> apenas marca <code>deletedAt</code>.
                    Nada é apagado do arquivo JSON e o cadastro pode ser
                    restaurado.
                  </span>
                </div>
              </div>
            ) : null}

            {error ? (
              <ErrorState
                message={error}
                onRetry={() => reload()}
                loading={loading}
              />
            ) : loading ? (
              <TableSkeleton />
            ) : visiblePets.length === 0 ? (
              <EmptyState {...emptyState} />
            ) : isArchivedView ? (
              <ArchivedList
                pets={visiblePets}
                onSelect={setSelectedPet}
                onRestore={handleRestore}
                restoringId={restoringId}
              />
            ) : (
              <PetsTable
                pets={visiblePets}
                onSelect={setSelectedPet}
                onEdit={openEdit}
                onArchive={handleArchiveRequest}
              />
            )}
          </section>

          <footer className="page-footer">
            <span>
              <PawPrint size={14} />
              PetCare · Projeto parcial PTAS3
            </span>
            <span>Express + Zod + React</span>
          </footer>
        </main>
      </div>

      <PetFormModal
        open={formState.open}
        pet={formState.pet}
        onClose={closeForm}
        onSubmit={handleSubmit}
      />

      <PetDetailsDrawer
        pet={selectedPet}
        onClose={() => setSelectedPet(null)}
        onEdit={openEdit}
        onArchive={handleArchiveRequest}
        onRestore={handleRestore}
        restoring={restoringId === selectedPet?.id}
      />

      <ConfirmDialog
        pet={confirmPet}
        onClose={() => setConfirmPet(null)}
        onConfirm={handleConfirmArchive}
        loading={archiving}
      />

      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />

      <Toasts toasts={toasts} onDismiss={dismiss} />
    </div>
  );
};

export default App;
