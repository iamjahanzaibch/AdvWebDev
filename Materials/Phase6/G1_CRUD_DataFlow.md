# Booking System Phase6 CRUD Data Flow

This file models the Phase6 CRUD operations using the same sequence-diagram style as the provided CREATE example.

Runtime verification performed on local Phase6 deployment (`docker compose up -d`) at `http://localhost:5000` with API checks from the running app behavior and endpoint calls.

## 1) CREATE - Resource

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (form.js)
    participant B as Backend (Express Route: resources.routes.js)
    participant V as express-validator
    participant DB as PostgreSQL (resources table)
    participant L as Service Layer (log.service.js)

    U->>F: Submit Create form
    F->>F: Build payload from inputs
    F->>B: POST /api/resources (JSON)

    B->>V: Validate request body
    V-->>B: Validation result

    alt Validation fails
        B-->>F: 400 Bad Request + errors[]
        F-->>U: Show validation errors
    else Validation OK
        B->>DB: INSERT INTO resources (...) RETURNING ...
        DB-->>B: Created row or unique violation (23505)

        alt Duplicate name
            B-->>F: 409 Conflict + error
            F-->>U: Show duplicate message
        else Insert success
            B->>L: logEvent("Resource created")
            L-->>B: Logging done (non-blocking)
            B-->>F: 201 Created + data
            F-->>U: Show success message
        end
    end

    alt Unexpected backend/db error
        B-->>F: 500 Internal Server Error
        F-->>U: Show generic server error
    end
```

## 2) READ - Resource List

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (resources.js)
    participant B as Backend (Express Route: resources.routes.js)
    participant DB as PostgreSQL (resources table)

    U->>F: Open /resources page
    F->>F: loadResources()
    F->>B: GET /api/resources

    B->>DB: SELECT * FROM resources ORDER BY created_at DESC
    DB-->>B: rows[]

    alt Success
        B-->>F: 200 OK + data[]
        F->>F: Cache results + renderResourceList()
        F-->>U: Display resource list
    else Database error
        B-->>F: 500 Internal Server Error
        F->>F: console.error("Failed to load resources")
        F-->>U: Render empty list/fallback state
    end
```

## 3) UPDATE - Resource

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (resources.js + form.js)
    participant B as Backend (Express Route: resources.routes.js)
    participant V as express-validator
    participant DB as PostgreSQL (resources table)
    participant L as Service Layer (log.service.js)

    U->>F: Select resource and submit Update
    F->>F: Ensure resourceId exists + build payload
    F->>B: PUT /api/resources/:id (JSON)

    B->>B: Parse and validate :id
    alt Invalid ID
        B-->>F: 400 Bad Request + error("Invalid ID")
        F-->>U: Show error message
    else ID format OK
        B->>V: Validate request body
        V-->>B: Validation result

        alt Body validation fails
            B-->>F: 400 Bad Request + errors[]
            F-->>U: Show validation errors
        else Validation OK
            B->>DB: UPDATE resources SET ... WHERE id=$6 RETURNING *
            DB-->>B: Updated row / none / unique violation (23505)

            alt Resource not found
                B-->>F: 404 Not Found
                F-->>U: Show not-found message
            else Duplicate name
                B-->>F: 409 Conflict + error
                F-->>U: Show duplicate message
            else Update success
                B->>L: logEvent("Resource updated")
                L-->>B: Logging done (non-blocking)
                B-->>F: 200 OK + updated data
                F-->>U: Show success message
            end
        end
    end

    alt Unexpected backend/db error
        B-->>F: 500 Internal Server Error
        F-->>U: Show generic server error
    end
```

## 4) DELETE - Resource

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (form.js)
    participant B as Backend (Express Route: resources.routes.js)
    participant DB as PostgreSQL (resources table)
    participant L as Service Layer (log.service.js)

    U->>F: Select resource and click Delete
    F->>F: Ensure resourceId exists
    F->>B: DELETE /api/resources/:id

    B->>B: Parse and validate :id
    alt Invalid ID
        B-->>F: 400 Bad Request + error("Invalid ID")
        F-->>U: Show error message
    else ID format OK
        B->>DB: DELETE FROM resources WHERE id=$1
        DB-->>B: rowCount

        alt Resource not found
            B-->>F: 404 Not Found + error
            F-->>U: Show not-found message
        else Delete success
            B->>L: logEvent("Resource deleted")
            L-->>B: Logging done (non-blocking)
            B-->>F: 204 No Content
            F-->>U: Show success message and refresh list
        end
    end

    alt Unexpected backend/db error
        B-->>F: 500 Internal Server Error
        F-->>U: Show generic server error
    end
```

## Quick verification notes (Phase6)

Observed endpoint behavior while Phase6 was running:

- `POST /api/resources` -> `201` on success, `400` with `errors[]` on validation failure, `409` on duplicate resource name.
- `GET /api/resources` -> `200` with `data[]`.
- `PUT /api/resources/:id` -> `200` on success, `400` (invalid ID or validation errors), `404` when ID does not exist, `409` on duplicate name.
- `DELETE /api/resources/:id` -> `204` on success, `400` for invalid ID, `404` when ID does not exist.
