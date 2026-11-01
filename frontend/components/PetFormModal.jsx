import { useEffect, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  Check,
  Loader2,
  MessageSquareText,
  PawPrint,
  Pencil,
  Plus,
  Users,
} from "lucide-react";
import { ApiError } from "../services/api.js";
import {
  SIZE_OPTIONS,
  SPECIES_OPTIONS,
  todayISO,
} from "../utils/format.js";
import Modal from "./Modal.jsx";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;

const EMPTY_FORM = {
  name: "",
  species: "cao",
  breed: "",
  size: "pequeno",
  birthDate: "",
  tutor: {
    name: "",
    phone: "",
    email: "",
  },
  notes: "",
};

const toFormValues = (pet) =>
  pet
    ? {
        name: pet.name,
        species: pet.species,
        breed: pet.breed ?? "",
        size: pet.size,
        birthDate: pet.birthDate ?? "",
        tutor: {
          name: pet.tutor.name,
          phone: pet.tutor.phone,
          email: pet.tutor.email ?? "",
        },
        notes: pet.notes ?? "",
      }
    : EMPTY_FORM;

const validate = (values) => {
  const errors = {};

  if (values.name.trim().length < 2) {
    errors.name = "Informe o nome do pet (mínimo 2 caracteres).";
  } else if (values.name.trim().length > 60) {
    errors.name = "O nome pode ter no máximo 60 caracteres.";
  }

  if (!SPECIES_OPTIONS.some((option) => option.value === values.species)) {
    errors.species = "Selecione uma espécie válida.";
  }

  if (!SIZE_OPTIONS.some((option) => option.value === values.size)) {
    errors.size = "Selecione um porte válido.";
  }

  if (values.breed.trim().length > 60) {
    errors.breed = "A raça pode ter no máximo 60 caracteres.";
  }

  if (values.birthDate && values.birthDate > todayISO()) {
    errors.birthDate = "A data de nascimento não pode estar no futuro.";
  }

  if (values.tutor.name.trim().length < 2) {
    errors["tutor.name"] = "Informe o nome do tutor.";
  }

  if (!PHONE_REGEX.test(values.tutor.phone.trim())) {
    errors["tutor.phone"] = "Informe um telefone válido com DDD.";
  }

  const email = values.tutor.email.trim();

  if (email && !EMAIL_REGEX.test(email)) {
    errors["tutor.email"] = "Informe um e-mail válido.";
  }

  if (values.notes.trim().length > 500) {
    errors.notes = "As observações podem ter no máximo 500 caracteres.";
  }

  return errors;
};

const Field = ({ label, hint, required, error, className = "", children }) => (
  <label className={`field ${className} ${error ? "has-error" : ""}`}>
    <span className="field__label">
      {label}
      {required ? <em>*</em> : null}
      {hint ? <small>{hint}</small> : null}
    </span>
    {children}
    {error ? <span className="field__error">{error}</span> : null}
  </label>
);

const PetFormModal = ({ open, pet, onClose, onSubmit }) => {
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(pet);

  useEffect(() => {
    if (!open) {
      return;
    }

    setValues(pet ? toFormValues(pet) : EMPTY_FORM);
    setErrors({});
    setFormError(null);
    setSubmitting(false);
  }, [open, pet]);

  const clearError = (field) => {
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
    setFormError(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    clearError(name);
  };

  const handleTutorChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({
      ...current,
      tutor: { ...current.tutor, [name]: value },
    }));
    clearError(`tutor.${name}`);
  };

  const handleClose = () => {
    if (!submitting) {
      onClose();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    const nextErrors = validate(values);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError("Revise os campos destacados antes de continuar.");
      return;
    }

    const payload = {
      name: values.name.trim(),
      species: values.species,
      breed: values.breed.trim() || null,
      size: values.size,
      birthDate: values.birthDate || null,
      tutor: {
        name: values.tutor.name.trim(),
        phone: values.tutor.phone.trim(),
        email: values.tutor.email.trim() || null,
      },
      notes: values.notes.trim() || null,
    };

    setSubmitting(true);
    setFormError(null);

    try {
      await onSubmit(payload);
      onClose();
    } catch (submitError) {
      if (
        submitError instanceof ApiError &&
        submitError.status === 400 &&
        submitError.details?.length > 0
      ) {
        const mapped = {};

        for (const detail of submitError.details) {
          mapped[detail.field] = detail.message;
        }

        setErrors(mapped);
        setFormError("A API recusou alguns campos. Confira os destaques.");
      } else {
        setFormError(
          submitError?.message || "Não foi possível salvar o pet.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEditing ? `Editar ${pet.name}` : "Novo pet"}
      description={
        isEditing
          ? "Atualize a ficha do pet e os dados do tutor."
          : "Cadastre um novo pet e o contato do tutor responsável."
      }
      icon={isEditing ? Pencil : PawPrint}
      size="lg"
      footer={
        <>
          <button
            type="button"
            className="button button--ghost"
            onClick={handleClose}
            disabled={submitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="pet-form"
            className="button button--primary"
            disabled={submitting}
          >
            {submitting ? (
              <Loader2 size={16} className="spin" />
            ) : isEditing ? (
              <Check size={16} />
            ) : (
              <Plus size={16} />
            )}
            {submitting
              ? "Salvando..."
              : isEditing
                ? "Salvar alterações"
                : "Cadastrar pet"}
          </button>
        </>
      }
    >
      <form id="pet-form" className="pet-form" onSubmit={handleSubmit} noValidate>
        <section className="form-section">
          <div className="form-section__title">
            <span className="form-section__icon">
              <PawPrint size={18} />
            </span>
            <div>
              <h3>Dados do pet</h3>
              <p>Informações principais do animal.</p>
            </div>
          </div>

          <div className="form-grid">
            <Field
              label="Nome do pet"
              required
              error={errors.name}
              className="field--full"
            >
              <input
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                placeholder="Ex.: Mel"
                maxLength={60}
                autoFocus
                aria-invalid={Boolean(errors.name)}
              />
            </Field>

            <Field label="Espécie" required error={errors.species}>
              <select
                name="species"
                value={values.species}
                onChange={handleChange}
                aria-invalid={Boolean(errors.species)}
              >
                {SPECIES_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Porte" required error={errors.size}>
              <select
                name="size"
                value={values.size}
                onChange={handleChange}
                aria-invalid={Boolean(errors.size)}
              >
                {SIZE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Raça" hint="Opcional" error={errors.breed}>
              <input
                type="text"
                name="breed"
                value={values.breed}
                onChange={handleChange}
                placeholder="Ex.: Golden Retriever"
                maxLength={60}
              />
            </Field>

            <Field
              label="Nascimento"
              hint="Opcional"
              error={errors.birthDate}
            >
              <span className="input-with-icon">
                <CalendarDays size={16} />
                <input
                  type="date"
                  name="birthDate"
                  value={values.birthDate}
                  onChange={handleChange}
                  max={todayISO()}
                  aria-invalid={Boolean(errors.birthDate)}
                />
              </span>
            </Field>
          </div>
        </section>

        <section className="form-section">
          <div className="form-section__title">
            <span className="form-section__icon form-section__icon--peach">
              <Users size={18} />
            </span>
            <div>
              <h3>Dados do tutor</h3>
              <p>Quem cuida e responde pelo pet.</p>
            </div>
          </div>

          <div className="form-grid">
            <Field
              label="Nome do tutor"
              required
              error={errors["tutor.name"]}
              className="field--full"
            >
              <input
                type="text"
                name="name"
                value={values.tutor.name}
                onChange={handleTutorChange}
                placeholder="Ex.: Ana Beatriz Souza"
                maxLength={80}
                aria-invalid={Boolean(errors["tutor.name"])}
              />
            </Field>

            <Field
              label="Telefone"
              required
              hint="Com DDD"
              error={errors["tutor.phone"]}
            >
              <input
                type="tel"
                name="phone"
                value={values.tutor.phone}
                onChange={handleTutorChange}
                placeholder="(67) 99999-9999"
                maxLength={20}
                aria-invalid={Boolean(errors["tutor.phone"])}
              />
            </Field>

            <Field
              label="E-mail"
              hint="Opcional"
              error={errors["tutor.email"]}
            >
              <input
                type="email"
                name="email"
                value={values.tutor.email}
                onChange={handleTutorChange}
                placeholder="tutor@email.com"
                maxLength={120}
                aria-invalid={Boolean(errors["tutor.email"])}
              />
            </Field>
          </div>
        </section>

        <section className="form-section">
          <div className="form-section__title">
            <span className="form-section__icon form-section__icon--blue">
              <MessageSquareText size={18} />
            </span>
            <div>
              <h3>Observações</h3>
              <p>Alergias, preferências e cuidados especiais.</p>
            </div>
          </div>

          <div className="form-grid">
            <Field
              label="Anotações"
              hint="Opcional · até 500 caracteres"
              error={errors.notes}
              className="field--full"
            >
              <textarea
                name="notes"
                value={values.notes}
                onChange={handleChange}
                rows={3}
                maxLength={500}
                placeholder="Ex.: Alergia a frango, prefere secagem natural..."
              />
            </Field>
          </div>
        </section>

        {formError ? (
          <div className="form-alert" role="alert">
            <AlertCircle size={17} />
            <span>{formError}</span>
          </div>
        ) : null}
      </form>
    </Modal>
  );
};

export default PetFormModal;
