import { PawPrint, Plus } from "lucide-react";

const EmptyState = ({
  icon: Icon = PawPrint,
  title,
  description,
  actionLabel,
  onAction,
  actionVariant = "primary",
}) => (
  <div className="empty-state">
    <span className="empty-state__icon">
      <Icon size={28} />
    </span>
    <h3>{title}</h3>
    <p>{description}</p>

    {actionLabel ? (
      <button
        type="button"
        className={`button button--${actionVariant}`}
        onClick={onAction}
      >
        <Plus size={16} />
        {actionLabel}
      </button>
    ) : null}
  </div>
);

export default EmptyState;
