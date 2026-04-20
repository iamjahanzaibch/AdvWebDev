export default function FormResponse({ status, submittedData, responseData, errorMessage }) {
  if (status === "idle") {
    return (
      <aside className="response-panel response-panel--empty" aria-live="polite">
        <h2 className="response-panel__title">Submission response</h2>
        <p className="response-panel__lead">
          Submit the form to send the booking data to the backend API. The saved booking details will appear here.
        </p>
        <p className="response-panel__empty-state">No submission yet.</p>
      </aside>
    );
  }

  if (status === "error") {
    return (
      <aside className="response-panel response-panel--error" aria-live="assertive">
        <h2 className="response-panel__title">Submission failed</h2>
        <p className="response-panel__lead">The request did not reach the backend server.</p>
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
      <h2 className="response-panel__title">Booking confirmation</h2>
      <p className="response-panel__lead">Your booking has been successfully saved to the database!</p>

      <div className="response-panel__message">Booking ID: {responseData.booking?.id || "N/A"}</div>

      <div className="response-panel__summary">
        <div className="response-metric">
          <span className="response-metric__label">Status</span>
          <span className="response-metric__value">{responseData.statusCode}</span>
        </div>
        <div className="response-metric">
          <span className="response-metric__label">Message</span>
          <span className="response-metric__value">{responseData.message || "Success"}</span>
        </div>
        <div className="response-metric">
          <span className="response-metric__label">Created at</span>
          <span className="response-metric__value">
            {responseData.booking?.created_at ? new Date(responseData.booking.created_at).toLocaleString() : "N/A"}
          </span>
        </div>
      </div>

      <div className="response-panel__section">
        <h3 className="response-panel__section-title">Submitted data</h3>
        <pre className="response-panel__pre">{JSON.stringify(submittedData, null, 2)}</pre>
      </div>

      <div className="response-panel__section">
        <h3 className="response-panel__section-title">Saved booking</h3>
        <pre className="response-panel__pre">{JSON.stringify(responseData.booking, null, 2)}</pre>
      </div>
    </aside>
  );
}
