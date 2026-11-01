import {
  CheckCircle2,
  ChevronRight,
  Database,
  FileJson,
  Layers,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import Modal from "./Modal.jsx";

const FLOW = [
  { name: "Routes", detail: "Define verbos e caminhos" },
  { name: "Controllers", detail: "Lê req e devolve status" },
  { name: "Services", detail: "Aplica regras de negócio" },
  { name: "Models", detail: "Lê e grava no JSON" },
  { name: "pets.json", detail: "Persistência dos dados" },
];

const FEATURES = [
  "CRUD completo com GET, POST, PUT e DELETE",
  "Validação com zod no POST e no PUT",
  "Middleware de log com status e tempo",
  "Handler de erro centralizado",
  "Soft delete com restauração",
  "Status codes 200, 201, 204, 400, 404 e 500",
];

const ENDPOINTS = [
  { method: "GET", path: "/pets", detail: "Lista os pets ativos" },
  { method: "GET", path: "/pets/:id", detail: "Detalhe de um pet" },
  { method: "POST", path: "/pets", detail: "Cadastra um pet" },
  { method: "PUT", path: "/pets/:id", detail: "Atualiza um pet" },
  { method: "DELETE", path: "/pets/:id", detail: "Arquiva um pet" },
  { method: "POST", path: "/pets/:id/restore", detail: "Restaura um pet" },
];

const AboutModal = ({ open, onClose }) => (
  <Modal
    open={open}
    onClose={onClose}
    title="Sobre o projeto"
    description="PetCare · Projeto parcial de PTAS3"
    icon={Sparkles}
    size="lg"
    footer={
      <button type="button" className="button button--primary" onClick={onClose}>
        Entendi
      </button>
    }
  >
    <div className="about">
      <p className="about__intro">
        O PetCare é um sistema de gestão para Pet Shop. Este projeto parcial
        entrega o CRUD de <strong>pets</strong> em uma API REST organizada em
        camadas, com validação de dados, tratamento de erros e um painel React
        para operar o dia a dia do estabelecimento.
      </p>

      <section className="about__section">
        <h3>
          <Workflow size={17} />
          Arquitetura em camadas
        </h3>

        <div className="about-flow">
          {FLOW.map((step, index) => (
            <div className="about-flow__item" key={step.name}>
              <div className="about-flow__step">
                <span>{index + 1}</span>
                <strong>{step.name}</strong>
                <small>{step.detail}</small>
              </div>
              {index < FLOW.length - 1 ? (
                <ChevronRight size={16} className="about-flow__arrow" />
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="about__section">
        <h3>
          <CheckCircle2 size={17} />
          O que foi entregue
        </h3>
        <ul className="about__features">
          {FEATURES.map((feature) => (
            <li key={feature}>
              <CheckCircle2 size={15} />
              {feature}
            </li>
          ))}
        </ul>
      </section>

      <section className="about__section">
        <h3>
          <FileJson size={17} />
          Endpoints da API
        </h3>
        <div className="endpoint-list">
          {ENDPOINTS.map((endpoint) => (
            <div className="endpoint" key={`${endpoint.method}-${endpoint.path}`}>
              <span className={`method method--${endpoint.method.toLowerCase()}`}>
                {endpoint.method}
              </span>
              <code>{endpoint.path}</code>
              <span>{endpoint.detail}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="about__notes">
        <div>
          <Layers size={16} />
          <span>React + Vite no frontend, Express + zod no backend.</span>
        </div>
        <div>
          <Database size={16} />
          <span>
            O cliente HTTP centralizado (Aula 07) concentra URL, headers e
            erros.
          </span>
        </div>
        <div>
          <ShieldCheck size={16} />
          <span>
            O DELETE é um soft delete: o registro ganha <code>deletedAt</code>{" "}
            e pode ser restaurado.
          </span>
        </div>
      </div>
    </div>
  </Modal>
);

export default AboutModal;
