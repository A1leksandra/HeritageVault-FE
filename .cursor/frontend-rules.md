# Cursor Rules — HeritageVault Frontend (React + MUI)

## Authoritative sources
When generating frontend code, ALWAYS follow in this order:
1) docs/frontend-scope.md
2) openapi.json (HV.WebAPI | v1) :contentReference[oaicite:3]{index=3}

If there is any conflict:
- OpenAPI schema MUST win for routes and DTO shapes.

---

## Tech stack (mandatory)
- React 18
- TypeScript
- Material UI (MUI)
- @mui/x-data-grid for list views
- Axios for HTTP
- React Router

MUST NOT add:
- Redux, Zustand, MobX
- Tailwind or other CSS frameworks
- authentication libraries

---

## Project structure
- `src/api/` — Axios instance and API functions per resource
- `src/types/` — TypeScript DTO types matching OpenAPI
- `src/pages/` — routed pages (Landmarks, Countries, Regions, Cities)
- `src/components/` — reusable UI (tables, dialogs, forms)
- `src/utils/` — enum label maps and helpers

---

## API usage rules
- Base API URL MUST come from environment variable:
  - `VITE_API_BASE_URL`
- All HTTP calls MUST go through a single Axios instance.
- multipart/form-data MUST be used for image uploads.

### Type fidelity
- IDs may be `number | string` in API responses.
- Frontend MUST normalize IDs to `number` internally.
- Nullable fields MUST be typed as `T | null`.

---

## Landmark image rules
- Upload uses `POST /api/Landmarks/{id}/image`.
- File input must accept common image types (png, jpg, jpeg, webp).
- Upload replaces existing image.
- Delete removes image only.
- UI MUST refresh landmark details after image operations.

---

## UI rules
- Lists MUST use MUI DataGrid.
- Create/Edit MUST use MUI Dialogs.
- Enum fields MUST use Select components.
- ExternalRegistryUrl MUST open in a new browser tab.
- ImageUrl MUST be rendered as `<img>` preview when present.

---

## Error handling
- API errors MUST be displayed using MUI Snackbar + Alert.
- Do not rely only on console logging.

---

## No scope creep
MUST NOT add:
- authentication
- tags
- user profiles
- advanced dashboards or charts
unless frontend-scope.md or openapi.json is updated.
