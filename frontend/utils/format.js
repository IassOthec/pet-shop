export const SPECIES_OPTIONS = [
  { value: "cao", label: "Cão", plural: "Cães" },
  { value: "gato", label: "Gato", plural: "Gatos" },
  { value: "ave", label: "Ave", plural: "Aves" },
  { value: "roedor", label: "Roedor", plural: "Roedores" },
  { value: "reptil", label: "Réptil", plural: "Répteis" },
  { value: "outro", label: "Outro", plural: "Outros" },
];

export const SPECIES_LABELS = Object.fromEntries(
  SPECIES_OPTIONS.map((option) => [option.value, option.label]),
);

export const SIZE_OPTIONS = [
  { value: "pequeno", label: "Pequeno" },
  { value: "medio", label: "Médio" },
  { value: "grande", label: "Grande" },
];

export const SIZE_LABELS = Object.fromEntries(
  SIZE_OPTIONS.map((option) => [option.value, option.label]),
);

const parseDateOnly = (value) => {
  if (!value) {
    return null;
  }

  const [year, month, day] = String(value).split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
};

export const formatDate = (value, options = {}) => {
  if (!value) {
    return "—";
  }

  const date = value.length === 10 ? parseDateOnly(value) : new Date(value);

  if (!date || Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options,
  }).format(date);
};

export const formatDateTime = (value) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
};

export const formatLongDate = (date = new Date()) =>
  new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);

export const formatPhone = (value) => {
  if (!value) {
    return "—";
  }

  const digits = String(value).replace(/\D/g, "");

  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return value;
};

export const calculateAge = (birthDate) => {
  const birth = parseDateOnly(birthDate);

  if (!birth) {
    return "Idade não informada";
  }

  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  const hadBirthday =
    now.getMonth() > birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate());

  if (!hadBirthday) {
    years -= 1;
  }

  if (years >= 1) {
    return `${years} ${years === 1 ? "ano" : "anos"}`;
  }

  let months =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth());

  if (now.getDate() < birth.getDate()) {
    months -= 1;
  }

  const safeMonths = Math.max(months, 0);

  return `${safeMonths} ${safeMonths === 1 ? "mês" : "meses"}`;
};

export const normalizeText = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export const todayISO = () => {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
};

export const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
