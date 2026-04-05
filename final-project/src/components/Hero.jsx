import StatusCard from "./StatusCard";

export default function Hero({ content, status }) {
  return (
    <section className="hero">
      <div className="hero__copy">
        <span className="hero__eyebrow">{content.badge}</span>
        <h1 className="hero__title">{content.title}</h1>
        <p className="hero__description">{content.description}</p>

        <div className="hero__actions">
          <a href={content.primaryAction.href} className="button button--primary">
            {content.primaryAction.label}
          </a>
          <a href={content.secondaryAction.href} className="button button--secondary">
            {content.secondaryAction.label}
          </a>
        </div>
      </div>

      <StatusCard status={status} />
    </section>
  );
}
