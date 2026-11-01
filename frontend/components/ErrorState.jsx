import { AlertTriangle, RefreshCw } from "lucide-react";

const ErrorState = ({ message, onRetry, loading }) => (
  <div className="error-state" role="alert">
    <span className="error-state__icon">
      <AlertTriangle size={22} />
    </span>

    <div className="error-state__content">
      <h3>Não foi possível carregar os dados</h3>
      <p>{message}</p>
    </div>

    <button
      type="button"
      className="button button--secondary"
      onClick={onRetry}
      disabled={loading}
    >
      <RefreshCw size={16} className={loading ? "spin" : ""} />
      Tentar novamente
    </button>
  </div>
);

export default ErrorState;
