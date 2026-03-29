import { initAuthUI, requireAuthOrBlockPage, logout } from "./auth-ui.js";

initAuthUI();
if (!requireAuthOrBlockPage()) {
  throw new Error("Authentication required");
}
window.logout = logout;

function $(id) {
  return document.getElementById(id);
}

const form = $("reservationForm");
const reservationIdInput = $("reservationId");
const resourceIdInput = $("resourceId");
const userIdInput = $("userId");
const startTimeInput = $("startTime");
const endTimeInput = $("endTime");
const noteInput = $("note");
const statusInput = $("status");
const actionsEl = $("reservationActions");
const listEl = $("reservationList");
const messageEl = $("formMessage");

let reservationsCache = [];
let selectedReservationId = null;
let formMode = "create";

const BUTTON_BASE_CLASSES =
  "w-full rounded-2xl px-6 py-3 text-sm font-semibold transition-all duration-200 ease-out";
const BUTTON_PRIMARY_CLASSES = "bg-brand-primary text-white hover:bg-brand-dark/80 shadow-soft";
const BUTTON_NEUTRAL_CLASSES = "border border-black/10 bg-white text-black/80 hover:bg-black/5";

function showMessage(type, message) {
  if (!messageEl) return;

  messageEl.className = "mt-6 rounded-2xl border px-4 py-3 text-sm whitespace-pre-line";
  messageEl.classList.remove("hidden");

  if (type === "success") {
    messageEl.classList.add("border-emerald-200", "bg-emerald-50", "text-emerald-900");
  } else if (type === "info") {
    messageEl.classList.add("border-amber-200", "bg-amber-50", "text-amber-900");
  } else {
    messageEl.classList.add("border-rose-200", "bg-rose-50", "text-rose-900");
  }

  messageEl.textContent = message;
}

function clearMessage() {
  if (!messageEl) return;
  messageEl.textContent = "";
  messageEl.classList.add("hidden");
}

function toIsoFromLocal(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString();
}

function toLocalInput(isoValue) {
  if (!isoValue) return "";
  const date = new Date(isoValue);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (n) => String(n).padStart(2, "0");
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const h = pad(date.getHours());
  const min = pad(date.getMinutes());
  return `${y}-${m}-${d}T${h}:${min}`;
}

function getHeaders() {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

function getAuthOnlyHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

function getPayloadFromForm() {
  return {
    resourceId: Number(resourceIdInput?.value || 0),
    userId: Number(userIdInput?.value || 0),
    startTime: toIsoFromLocal(startTimeInput?.value),
    endTime: toIsoFromLocal(endTimeInput?.value),
    note: noteInput?.value?.trim() || "",
    status: statusInput?.value || "active",
  };
}

function validatePayload(payload) {
  if (!payload.resourceId || payload.resourceId < 1) {
    return "Resource ID must be a positive number.";
  }

  if (!payload.userId || payload.userId < 1) {
    return "User ID must be a positive number.";
  }

  if (!payload.startTime || !payload.endTime) {
    return "Start time and end time are required.";
  }

  if (new Date(payload.endTime) <= new Date(payload.startTime)) {
    return "End time must be later than start time.";
  }

  return null;
}

function addActionButton({ label, type = "button", value, classes = "" }) {
  const btn = document.createElement("button");
  btn.type = type;
  btn.textContent = label;
  if (value) btn.value = value;
  btn.className = `${BUTTON_BASE_CLASSES} ${classes}`.trim();
  actionsEl.appendChild(btn);
  return btn;
}

function renderActionButtons() {
  if (!actionsEl) return;

  actionsEl.innerHTML = "";

  if (formMode === "create") {
    addActionButton({
      label: "Create",
      type: "submit",
      value: "create",
      classes: BUTTON_PRIMARY_CLASSES,
    });
  } else {
    addActionButton({
      label: "Update",
      type: "submit",
      value: "update",
      classes: BUTTON_PRIMARY_CLASSES,
    });

    addActionButton({
      label: "Delete",
      type: "submit",
      value: "delete",
      classes: BUTTON_PRIMARY_CLASSES,
    });
  }

  const clearBtn = addActionButton({
    label: "Clear",
    type: "button",
    classes: BUTTON_NEUTRAL_CLASSES,
  });

  clearBtn.addEventListener("click", () => {
    clearForm();
    clearMessage();
  });
}

function clearForm() {
  if (!form) return;
  form.reset();
  selectedReservationId = null;
  if (reservationIdInput) reservationIdInput.value = "";
  formMode = "create";
  renderActionButtons();
  highlightSelectedReservation(null);
}

function selectReservation(item) {
  selectedReservationId = Number(item.id);
  if (reservationIdInput) reservationIdInput.value = String(item.id);

  if (resourceIdInput) {
    resourceIdInput.value = String(item.resource_id ?? item.resourceId ?? "");
  }

  if (userIdInput) {
    userIdInput.value = String(item.user_id ?? item.userId ?? "");
  }

  if (startTimeInput) {
    startTimeInput.value = toLocalInput(item.start_time ?? item.startTime);
  }

  if (endTimeInput) {
    endTimeInput.value = toLocalInput(item.end_time ?? item.endTime);
  }

  if (noteInput) {
    noteInput.value = item.note ?? "";
  }

  if (statusInput) {
    statusInput.value = item.status ?? "active";
  }

  formMode = "edit";
  renderActionButtons();
  highlightSelectedReservation(item.id);
}

function highlightSelectedReservation(id) {
  if (!listEl) return;
  listEl.querySelectorAll("[data-reservation-id]").forEach((button) => {
    const selected = id && Number(button.dataset.reservationId) === Number(id);
    button.classList.toggle("ring-2", selected);
    button.classList.toggle("ring-brand-blue/40", selected);
    button.classList.toggle("bg-brand-blue/5", selected);
  });
}

function renderReservationList(reservations) {
  if (!listEl) return;

  if (!Array.isArray(reservations) || reservations.length === 0) {
    listEl.innerHTML = `
      <div class="rounded-2xl border border-black/10 bg-black/5 px-4 py-3 text-sm text-black/60">
        No reservations found.
      </div>
    `;
    return;
  }

  listEl.innerHTML = reservations
    .map((r) => {
      const label = r.resource_name || `Resource #${r.resource_id}`;
      const start = r.start_time ? new Date(r.start_time).toLocaleString() : "-";
      const end = r.end_time ? new Date(r.end_time).toLocaleString() : "-";
      const status = r.status || "active";

      return `
        <button
          type="button"
          data-reservation-id="${r.id}"
          class="w-full text-left rounded-2xl border border-black/10 bg-white px-4 py-3 transition hover:bg-black/5"
          title="Select reservation"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <div class="font-semibold truncate">${label}</div>
              <div class="mt-1 text-xs text-black/60">${start} -> ${end}</div>
              <div class="mt-1 text-xs text-black/50">User #${r.user_id} | ${status}</div>
            </div>
          </div>
        </button>
      `;
    })
    .join("");

  listEl.querySelectorAll("[data-reservation-id]").forEach((button) => {
    button.addEventListener("click", () => {
      clearMessage();
      const id = Number(button.dataset.reservationId);
      const found = reservationsCache.find((item) => Number(item.id) === id);
      if (found) {
        selectReservation(found);
      }
    });
  });
}

async function loadReservations() {
  try {
    const response = await fetch("/api/reservations", {
      method: "GET",
      headers: getHeaders(),
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      showMessage("error", `Failed to load reservations (${response.status}).`);
      renderReservationList([]);
      return;
    }

    reservationsCache = Array.isArray(body.data) ? body.data : [];
    renderReservationList(reservationsCache);

    if (selectedReservationId) {
      const selected = reservationsCache.find((item) => Number(item.id) === Number(selectedReservationId));
      if (selected) {
        selectReservation(selected);
      }
    }
  } catch (error) {
    console.error("Failed to load reservations:", error);
    showMessage("error", "Could not reach server to load reservations.");
    renderReservationList([]);
  }
}

async function onSubmit(event) {
  event.preventDefault();
  clearMessage();

  const action = event.submitter?.value || "create";

  if ((action === "update" || action === "delete") && !selectedReservationId) {
    showMessage("error", "Select a reservation from the list first.");
    return;
  }

  const payload = getPayloadFromForm();
  const validationError = action === "delete" ? null : validatePayload(payload);
  if (validationError) {
    showMessage("error", validationError);
    return;
  }

  let method = "POST";
  let url = "/api/reservations";
  let body = null;

  if (action === "create") {
    method = "POST";
    body = JSON.stringify(payload);
  } else if (action === "update") {
    method = "PUT";
    url = `/api/reservations/${selectedReservationId}`;
    body = JSON.stringify(payload);
  } else if (action === "delete") {
    method = "DELETE";
    url = `/api/reservations/${selectedReservationId}`;
  }

  try {
    const response = await fetch(url, {
      method,
      headers: body ? getHeaders() : getAuthOnlyHeaders(),
      body,
    });

    const responseBody = response.status === 204 ? null : await response.json().catch(() => ({}));

    if (!response.ok) {
      const details = responseBody?.error ? ` ${responseBody.error}` : "";
      showMessage("error", `Request failed (${response.status}).${details}`);
      return;
    }

    if (action === "create") {
      showMessage("success", "Reservation created successfully.");
    } else if (action === "update") {
      showMessage("success", "Reservation updated successfully.");
    } else {
      showMessage("success", "Reservation deleted successfully.");
    }

    clearForm();
    await loadReservations();
  } catch (error) {
    console.error("Reservation request failed:", error);
    showMessage("error", "Network error: could not reach the server.");
  }
}

if (form) {
  form.addEventListener("submit", onSubmit);
}

renderActionButtons();
loadReservations();
