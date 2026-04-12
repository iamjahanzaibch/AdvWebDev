import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import FormResponse from "../components/FormResponse";

const initialFormData = {
  fullName: "",
  emailAddress: "",
  bookingDate: "",
  attendees: "2",
};

export default function FormPage() {
  const [formData, setFormData] = useState(initialFormData);
  const [fieldErrors, setFieldErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [responseData, setResponseData] = useState(null);
  const [submissionError, setSubmissionError] = useState("");
  const [submittedData, setSubmittedData] = useState(null);

  const today = useMemo(() => {
    const current = new Date();
    const offsetDate = new Date(current.getTime() - current.getTimezoneOffset() * 60000);
    return offsetDate.toISOString().slice(0, 10);
  }, []);

  const validate = (values) => {
    const nextErrors = {};

    if (values.fullName.trim().length < 3) {
      nextErrors.fullName = "Enter at least 3 characters.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.emailAddress.trim()) {
      nextErrors.emailAddress = "Email address is required.";
    } else if (!emailPattern.test(values.emailAddress.trim())) {
      nextErrors.emailAddress = "Enter a valid email address.";
    }

    if (!values.bookingDate) {
      nextErrors.bookingDate = "Choose a booking date.";
    } else if (values.bookingDate < today) {
      nextErrors.bookingDate = "Booking date cannot be in the past.";
    }

    const attendeeCount = Number(values.attendees);
    if (!Number.isInteger(attendeeCount)) {
      nextErrors.attendees = "Enter a whole number.";
    } else if (attendeeCount < 1 || attendeeCount > 8) {
      nextErrors.attendees = "Choose between 1 and 8 attendees.";
    }

    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => {
      if (!current[name]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[name];
      return nextErrors;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validate(formData);
    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle");
      setResponseData(null);
      setSubmissionError("");
      setSubmittedData(null);
      return;
    }

    const payload = {
      fullName: formData.fullName.trim(),
      emailAddress: formData.emailAddress.trim(),
      bookingDate: formData.bookingDate,
      attendees: Number(formData.attendees),
    };

    setStatus("submitting");
    setSubmissionError("");
    setResponseData(null);
    setSubmittedData(payload);

    try {
      const response = await fetch("https://httpbin.org/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`httpbin responded with status ${response.status}.`);
      }

      const data = await response.json();
      setResponseData({
        url: data.url,
        origin: data.origin,
        statusCode: response.status,
        json: data.json,
        headers: data.headers,
        data,
      });
      setStatus("success");
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : "Something went wrong while sending the form.");
      setStatus("error");
    }
  };

  const nameError = fieldErrors.fullName;
  const emailError = fieldErrors.emailAddress;
  const dateError = fieldErrors.bookingDate;
  const attendeesError = fieldErrors.attendees;

  return (
    <section className="form-page" aria-labelledby="form-page-title">
      <div className="form-page__top">
        <div className="form-page__hero">
          <span className="hero__eyebrow">Routed booking form</span>
          <h1 id="form-page-title" className="form-page__title">
            Send a booking request to httpbin
          </h1>
          <p className="form-page__description">
            This page uses the same booking-system theme as the home page, but it demonstrates routing, input
            validation, and a visible server response after submission.
          </p>
          <div className="form-page__actions">
            <Link to="/" className="button button--secondary">
              Back to home
            </Link>
          </div>
        </div>

        <form className="form-panel" onSubmit={handleSubmit} noValidate>
          <h2 className="form-panel__title">Booking details</h2>
          <p className="form-panel__lead">Fill in three different input types. Invalid data is blocked before submission.</p>

          <div className="booking-form">
            <div className="form-field">
              <label className="form-field__label" htmlFor="fullName">
                Full name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                className={`form-field__input ${nameError ? "form-field__input--invalid" : ""}`.trim()}
                placeholder="Amina Hassan"
                value={formData.fullName}
                onChange={handleChange}
                minLength={3}
                maxLength={60}
                required
                aria-invalid={nameError ? "true" : "false"}
                aria-describedby={nameError ? "fullName-error" : "fullName-hint"}
              />
              <p className="form-field__hint" id="fullName-hint">
                Use the name that should appear on the reservation.
              </p>
              {nameError ? (
                <p className="form-field__error" id="fullName-error">
                  {nameError}
                </p>
              ) : null}
            </div>

            <div className="form-field">
              <label className="form-field__label" htmlFor="emailAddress">
                Email address
              </label>
              <input
                id="emailAddress"
                name="emailAddress"
                type="email"
                className={`form-field__input ${emailError ? "form-field__input--invalid" : ""}`.trim()}
                placeholder="amina@example.com"
                value={formData.emailAddress}
                onChange={handleChange}
                required
                aria-invalid={emailError ? "true" : "false"}
                aria-describedby={emailError ? "emailAddress-error" : "emailAddress-hint"}
              />
              <p className="form-field__hint" id="emailAddress-hint">
                We will use this address to echo the submission back from httpbin.
              </p>
              {emailError ? (
                <p className="form-field__error" id="emailAddress-error">
                  {emailError}
                </p>
              ) : null}
            </div>

            <div className="form-field">
              <label className="form-field__label" htmlFor="bookingDate">
                Booking date
              </label>
              <input
                id="bookingDate"
                name="bookingDate"
                type="date"
                className={`form-field__input ${dateError ? "form-field__input--invalid" : ""}`.trim()}
                value={formData.bookingDate}
                onChange={handleChange}
                min={today}
                required
                aria-invalid={dateError ? "true" : "false"}
                aria-describedby={dateError ? "bookingDate-error" : "bookingDate-hint"}
              />
              <p className="form-field__hint" id="bookingDate-hint">
                Pick today or a future date.
              </p>
              {dateError ? (
                <p className="form-field__error" id="bookingDate-error">
                  {dateError}
                </p>
              ) : null}
            </div>

            <div className="form-field">
              <label className="form-field__label" htmlFor="attendees">
                Number of attendees
              </label>
              <input
                id="attendees"
                name="attendees"
                type="number"
                className={`form-field__input ${attendeesError ? "form-field__input--invalid" : ""}`.trim()}
                value={formData.attendees}
                onChange={handleChange}
                min={1}
                max={8}
                step={1}
                required
                aria-invalid={attendeesError ? "true" : "false"}
                aria-describedby={attendeesError ? "attendees-error" : "attendees-hint"}
              />
              <p className="form-field__hint" id="attendees-hint">
                Choose between 1 and 8 people.
              </p>
              {attendeesError ? (
                <p className="form-field__error" id="attendees-error">
                  {attendeesError}
                </p>
              ) : null}
            </div>

            {status === "submitting" ? (
              <p className="form-panel__status" aria-live="polite">
                Sending booking request to httpbin...
              </p>
            ) : null}

            {status === "success" ? (
              <p className="form-panel__status form-panel__status--success" aria-live="polite">
                Submission completed successfully.
              </p>
            ) : null}

            {status === "error" ? (
              <p className="form-panel__status form-panel__status--error" aria-live="assertive">
                {submissionError}
              </p>
            ) : null}

            <div className="form-panel__actions">
              <button className="button button--primary" type="submit" disabled={status === "submitting"}>
                {status === "submitting" ? "Submitting..." : "Send to httpbin"}
              </button>
              <button
                className="button button--secondary"
                type="button"
                onClick={() => {
                  setFormData(initialFormData);
                  setFieldErrors({});
                  setStatus("idle");
                  setResponseData(null);
                  setSubmissionError("");
                  setSubmittedData(null);
                }}
              >
                Clear form
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="form-page__response">
        <FormResponse
          status={status}
          submittedData={submittedData}
          responseData={responseData}
          errorMessage={submissionError}
        />
      </div>
    </section>
  );
}