import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const Toasts = ({ toasts, onDismiss }) => (
  <div className="toasts" aria-live="polite" aria-atomic="false">
    {toasts.map((toast) => {
      const Icon = ICONS[toast.type] ?? Info;

      return (
        <div
          className={`toast toast--${toast.type}`}
          key={toast.id}
          role="status"
        >
          <span className="toast__icon">
            <Icon size={18} />
          </span>
          <p>{toast.message}</p>
          <button
            type="button"
            className="toast__close"
            onClick={() => onDismiss(toast.id)}
            aria-label="Fechar aviso"
          >
            <X size={14} />
          </button>
        </div>
      );
    })}
  </div>
);

export default Toasts;
