import { Archive, Loader2 } from "lucide-react";
import Modal from "./Modal.jsx";

const ConfirmDialog = ({ pet, onClose, onConfirm, loading }) => {
  const petName = pet?.name ?? "este pet";

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Modal
      open={Boolean(pet)}
      onClose={handleClose}
      title={`Arquivar ${petName}?`}
      description="O cadastro sai da listagem ativa, mas não é apagado."
      icon={Archive}
      size="sm"
      footer={
        <>
          <button
            type="button"
            className="button button--ghost"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="button button--danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={16} className="spin" />
            ) : (
              <Archive size={16} />
            )}
            {loading ? "Arquivando..." : "Arquivar pet"}
          </button>
        </>
      }
    >
      <div className="confirm-body">
        <p>
          <strong>{petName}</strong> será movido para a área de{" "}
          <strong>Arquivados</strong>. O histórico e os dados do tutor
          continuam salvos no banco JSON.
        </p>

        <ul>
          <li>O pet deixa de aparecer na visão geral e nos indicadores.</li>
          <li>Você pode restaurar o cadastro a qualquer momento.</li>
          <li>Nenhum dado é removido permanentemente nesta operação.</li>
        </ul>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
