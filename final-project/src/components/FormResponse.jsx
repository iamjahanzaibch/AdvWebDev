export default function FormResponse({ status, submittedData, responseData, errorMessage }) {
  if (status === "idle") {
    return (
      <aside className="response-panel response-panel--empty" aria-live="polite">
        <h2 className="response-panel__title">Submission response</h2>
        <p className="response-panel__lead">
          Submit the form to send the data to httpbin. The echoed response will appear here.
        </p>
        <p className="response-panel__empty-state">No submission yet.</p>
      </aside>
    );
  }

  if (status === "error") {
    return (
      <aside className="response-panel response-panel--error" aria-live="assertive">
        <h2 className="response-panel__title">Submission failed</h2>
        <p className="response-panel__lead">The request did not reach httpbin.</p>
        <div className="response-panel__message response-panel__message--error">{errorMessage}</div>
        {submittedData ? (
          <div className="response-panel__section">
            <h3 className="response-panel__section-title">Last attempted payload</h3>
            <pre className="response-panel__pre">{JSON.stringify(submittedData, null, 2)}</pre>
          </div>
        ) : null}
      </aside>
    );
  }

  if (!responseData) {
    return null;
  }

  return (
    <aside className="response-panel" aria-live="polite">
      <h2 className="response-panel__title">Submission response</h2>
      <p className="response-panel__lead">The form was submitted successfully and httpbin returned the payload below.</p>

      <div className="response-panel__message">Sent to {responseData.url}</div>

      <div className="response-panel__summary">
        <div className="response-metric">
          <span className="response-metric__label">Status</span>
          <span className="response-metric__value">{responseData.statusCode}</span>
        </div>
        <div className="response-metric">
          <span className="response-metric__label">Origin</span>
          <span className="response-metric__value">{responseData.origin}</span>
        </div>
        <div className="response-metric">
          <span className="response-metric__label">Echoed keys</span>
          <span className="response-metric__value">{Object.keys(responseData.json || {}).join(", ")}</span>
        </div>
      </div>

      <div className="response-panel__section">
        <h3 className="response-panel__section-title">Sent data</h3>
        <pre className="response-panel__pre">{JSON.stringify(submittedData, null, 2)}</pre>
      </div>

      <div className="response-panel__section">
        <h3 className="response-panel__section-title">httpbin echo</h3>
        <pre className="response-panel__pre">{JSON.stringify(responseData.json, null, 2)}</pre>
      </div>

      <div className="response-panel__section">
        <h3 className="response-panel__section-title">Raw response</h3>
        <pre className="response-panel__pre">{JSON.stringify(responseData, null, 2)}</pre>
      </div>
    </aside>
  );
}