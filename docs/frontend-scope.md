# HeritageVault Frontend — Project Scope

## Domain summary
HeritageVault Frontend is a minimal React application that consumes the HeritageVault JSON API (HV.WebAPI | v1) and provides a simple, functional UI for managing and browsing historical landmarks.

The frontend is designed as an internal/admin-style interface:
- no authentication
- no ownership
- no user-specific behavior

Primary use cases:
- manage reference data: Countries, Regions, Cities
- create, update, delete Landmarks
- browse and filter Landmarks by location and status
- upload, replace, and delete Landmark images
- display landmark images when available

The frontend prioritizes correctness, clarity, and speed over visual customization.

---

## Backend API as source of truth
The frontend MUST strictly follow the OpenAPI schema defined in `openapi.json` (HV.WebAPI | v1). :contentReference[oaicite:1]{index=1}

The schema defines:
- available routes
- query parameters
- request/response DTOs
- enum representation (numeric)
- image upload endpoints

If there is any mismatch between UI assumptions and the OpenAPI schema, the schema MUST win.

---

## Core UI areas

### 1) Landmarks

#### List view
- Endpoint: `GET /api/Landmarks`
- Display a table of landmarks using a data grid.
- Supported filters (based on query parameters):
  - CityId
  - CountryId
  - RegionId
  - ProtectionStatus
  - PhysicalCondition
  - AccessibilityStatus
  - NameContains
- Columns (minimum):
  - Name
  - CityName
  - ProtectionStatus (label)
  - PhysicalCondition (label)
  - AccessibilityStatus (label)
  - Image preview (if ImageUrl exists)
  - Actions: View / Edit / Delete

#### Create / Edit
- Endpoints:
  - `POST /api/Landmarks`
  - `PUT /api/Landmarks/{id}`
- Use dialog-based forms.
- Editable fields:
  - CityId
  - Name
  - Description
  - Address
  - Latitude
  - Longitude
  - FirstMentionYear
  - ProtectionStatus
  - PhysicalCondition
  - AccessibilityStatus
  - ExternalRegistryUrl
- Enum fields are edited using select controls.

#### Details view
- Endpoint: `GET /api/Landmarks/{id}`
- Display all fields from `LandmarkDetailsDto`.
- Show image if `ImageUrl` is present.
- Show ExternalRegistryUrl as a clickable link (opens in new tab).

#### Image operations
- Upload / replace image:
  - `POST /api/Landmarks/{id}/image`
  - multipart/form-data
  - field name: `file`
- Delete image:
  - `DELETE /api/Landmarks/{id}/image`
- After upload or delete:
  - refresh landmark details
  - update image preview accordingly

---

### 2) Countries

- Endpoints:
  - `GET /api/Countries`
  - `POST /api/Countries`
  - `PUT /api/Countries/{id}`
  - `DELETE /api/Countries/{id}`
- Display list with Name and Code.
- Support IncludeDeleted toggle where applicable.
- Deletion is soft-delete.

---

### 3) Regions

- Endpoints:
  - `GET /api/Regions`
  - `POST /api/Regions`
  - `PUT /api/Regions/{id}`
  - `DELETE /api/Regions/{id}`
- Filter by CountryId.
- Deletion is soft-delete.

---

### 4) Cities

- Endpoints:
  - `GET /api/Cities`
  - `POST /api/Cities`
  - `PUT /api/Cities/{id}`
  - `DELETE /api/Cities/{id}`
- Filters:
  - CountryId
  - RegionId
  - IncludeDeleted
  - NameContains
- Deletion is soft-delete.

---

## Enum handling
Enums are represented as integers in the API. :contentReference[oaicite:2]{index=2}

The frontend MUST:
- treat enum values as numbers
- map enum values to human-readable labels for display
- use select inputs for enum editing

Enums:
- ProtectionStatus
- PhysicalCondition
- AccessibilityStatus

---

## Error handling (UI)
- API errors must be shown to users using visible notifications.
- Errors are not silently ignored.
- HTTP 400 and 404 errors should be shown as user-readable messages.

---

## Out of scope
- Authentication or authorization UI
- User management
- Role-based access
- Tags or categorization beyond backend scope
- Styling beyond default MUI theming
- Offline support
