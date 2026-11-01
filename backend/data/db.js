import { access, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Camada de persistência: um arquivo JSON que funciona como "banco".
 * Toda leitura/escrita do projeto passa por aqui — nenhuma outra camada
 * conhece o caminho do arquivo.
 */
const DB_FILE = fileURLToPath(new URL("./pets.json", import.meta.url));

// Serializa as escritas para evitar que duas requisições sobrescrevam
// uma à outra quando chegarem ao mesmo tempo.
let writeQueue = Promise.resolve();

const fileExists = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

export const ensureDatabase = async () => {
  if (await fileExists(DB_FILE)) {
    return;
  }

  await mkdir(dirname(DB_FILE), { recursive: true });
  await writeFile(DB_FILE, "[]\n", "utf8");
  console.log(`Banco JSON criado em ${DB_FILE}`);
};

export const readDatabase = async () => {
  await ensureDatabase();

  const raw = await readFile(DB_FILE, "utf8");
  const data = raw.trim() ? JSON.parse(raw) : [];

  if (!Array.isArray(data)) {
    throw new Error("O banco JSON deve conter um array de pets");
  }

  return data;
};

const writeDatabase = async (data) => {
  // Grava em um arquivo temporário e só então renomeia. Assim o JSON
  // nunca fica pela metade se o processo for interrompido.
  const temporaryFile = `${DB_FILE}.tmp`;
  await writeFile(temporaryFile, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  await rename(temporaryFile, DB_FILE);
};

/**
 * Executa uma mutação (push, update, delete) dentro de uma fila.
 * O mutador recebe o array, altera o que precisar e devolve o resultado
 * que será entregue ao model.
 */
export const updateDatabase = (mutator) => {
  const operation = writeQueue.then(async () => {
    const data = await readDatabase();
    const result = mutator(data);
    await writeDatabase(data);
    return result;
  });

  // Uma falha não deve travar a fila das próximas operações.
  writeQueue = operation.catch(() => undefined);

  return operation;
};

export { DB_FILE };
