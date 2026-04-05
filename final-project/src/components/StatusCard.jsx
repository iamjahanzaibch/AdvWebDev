export default function StatusCard({ status }) {
  return (
    <aside className="status-card">
      <div className="status-card__head">
        <h2 className="status-card__title">{status.heading}</h2>
        <span className="status-card__badge">{status.badge}</span>
      </div>

      <p className="status-card__text">
        <span>{status.lead}</span>
        <span>{status.body}</span>
        <span className="status-card__note">{status.note}</span>
      </p>

      <div className="status-card__actions">
        <a href={status.primaryAction.href} className="status-card__action status-card__action--ghost">
          {status.primaryAction.label}
        </a>
        <a href={status.secondaryAction.href} className="status-card__action status-card__action--solid">
          {status.secondaryAction.label}
        </a>
      </div>
    </aside>
  );
}
