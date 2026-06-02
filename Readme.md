
Got it. I reviewed the backend architecture and compiled a frontend-ready API contract plus a complete implementation roadmap. No code included.

Backend Architecture Overview

Layers: Routes → Controllers → Services → Models. Controllers are thin, services enforce business rules and DB access.
Auth: JWT access tokens + refresh tokens stored server-side (hashed) with rotation and family revocation.
Ownership: Enforced in services by scoping queries to ownerId. There is a requireOwnership middleware, but it is not used in routes; ownership is effectively enforced at the service/query layer.
Validation: Zod schemas via validate middleware; 400 errors include details with flattened Zod errors.
Errors: Consistent JSON errors { message, details? }, plus stack when not in production.
Rate limits: Auth endpoints (10/15m), password reset (5/15m), redirect (120/min).
Frontend-Ready API Contract

Base URL

https://<host> for production
http://localhost:4000 default in dev
Auth Header

Authorization: Bearer <accessToken>
Error Shape

Other errors:

Authentication APIs
POST /api/auth/signup

Auth required: No
Body: { email, password }
email valid email
password 8–72 chars
Params: none
Query: none
Success 201:
Errors: 400 validation, 409 email in use
Frontend usage: Signup form → store tokens → set auth state
POST /api/auth/login

Auth required: No
Body: { email, password }
Success 200: same as signup
Errors: 401 invalid credentials
Frontend usage: Login form → store tokens → set auth state
POST /api/auth/refresh

Auth required: No
Body: { refreshToken }
Success 200:
Errors: 401 unauthorized
Frontend usage: Axios interceptor refresh flow
POST /api/auth/logout

Auth required: No
Body: { refreshToken }
Success 200: { "message": "Logged out" }
Errors: none (silent if invalid token)
Frontend usage: Revoke current refresh token
POST /api/auth/logout-all

Auth required: Yes
Body: none
Success 200: { "message": "Logged out everywhere" }
Errors: 401 unauthorized
Frontend usage: Account security action
POST /api/auth/forgot-password

Auth required: No
Body: { email }
Success 200: { "message": "If the account exists, a reset link was issued." }
Non-prod: response may include { resetToken }
Errors: 400 validation, 429 rate limit
Frontend usage: Password reset request form
POST /api/auth/reset-password

Auth required: No
Body: { token, password }
Success 200: { "message": "Password reset successful" }
Errors: 400 invalid/expired token
Frontend usage: Reset password form
User API
GET /api/users/me

Auth required: Yes
Body: none
Success 200:
Errors: 401 unauthorized, 404 user not found
Frontend usage: Load profile for header/settings
URL APIs
POST /api/urls

Auth required: Yes
Body: { originalUrl, customAlias?, expiresAt? }
customAlias 4–32 chars [a-zA-Z0-9_-]
expiresAt ISO date string
Success 201:
Errors: 400 validation, 401, 409 alias exists, 400 safety failed
Frontend usage: Create form + show QR, copy short URL
GET /api/urls

Auth required: Yes
Body: none
Success 200: { "urls": [ { ... } ] }
Errors: 401
Frontend usage: Dashboard list
GET /api/urls/:id

Auth required: Yes
Params: id (24-char ObjectId)
Success 200: { "url": { ... } }
Errors: 401, 404 not found
Frontend usage: Edit page prefill
PATCH /api/urls/:id

Auth required: Yes
Body: { originalUrl?, expiresAt? } (at least one)
Success 200: { "url": { ... } }
Errors: 400 validation, 401, 404, 400 safety failed
Frontend usage: Save edits
DELETE /api/urls/:id

Auth required: Yes
Success 200:
Errors: 401, 404
Frontend usage: Delete confirmation
Redirect API
GET /r/:shortCode

Auth required: No
Query (optional): campaign or utm_campaign
Success 302: Redirect to original URL
Errors: 404 not found, 410 expired
Frontend usage: Public redirect
Analytics APIs (Authenticated)
GET /api/urls/:id/analytics

Auth required: Yes
Query: from?, to? (ISO date)
Success 200:
Errors: 400 date validation, 401, 404
GET /api/urls/:id/visits

Auth required: Yes
Query: page? (>=1), limit? (1–100), from?, to?
Success 200:
GET /api/urls/:id/browsers

Auth required: Yes
Query: from?, to?
Success 200: { "browsers": { "chrome": 0, "firefox": 0, "safari": 0, "edge": 0 } }
GET /api/urls/:id/devices

Auth required: Yes
Query: from?, to?
Success 200: { "devices": { "mobile": 0, "desktop": 0, "tablet": 0 } }
GET /api/urls/:id/trends

Auth required: Yes
Query: from?, to?
Success 200: { "trends": [ { "date": "YYYY-MM-DD", "count": 0 } ] }
Public Stats API
GET /stats/:shortCode

Auth required: No
Success 200:
Errors: 404 not found
Frontend usage: Public stats page
Bulk Upload API
POST /api/urls/bulk

Auth required: Yes
Body:
Success 200:
Errors: 400 validation, 401, CSV > 5MB, > 500 rows
Frontend usage: CSV parse → build rows → POST
Flow Explanations

JWT authentication flow

Access tokens signed with JWT_ACCESS_SECRET and include sub and role.
Frontend stores access token (memory + optional storage) and attaches via Authorization: Bearer.
On 401, trigger refresh flow.
Refresh token flow

Refresh tokens are JWTs stored hashed in DB.
/refresh rotates token family: old token revoked, new refresh token issued.
If a refresh token is reused or revoked, entire family is revoked (global logout).
Ownership authorization

URL access is enforced by queries scoped to ownerId. If the record is not owned, the service returns 404.
Redirect flow

/r/:shortCode resolves Url, checks expiration, writes Visit, increments clickCount, and returns 302 redirect.
Analytics flow

Visits are recorded with browser/device/OS, bot detection, referrer, campaign, click quality.
Authenticated analytics endpoints aggregate Visit records with optional date filters.
Public stats flow

/stats/:shortCode aggregates clicks, browsers, devices, trends without auth.
QR generation flow

On URL creation (single or bulk), QR code is generated from the short URL and returned as qrCodeDataUrl.
Bulk upload flow

Validates size/row count/aliases; per-row success or failure with error details.
URL safety flow

Local validation blocks disallowed protocols, private IPs, invalid hostnames.
Optional Safe Browsing and VirusTotal checks using API keys; failures can mark URLs as suspicious or malicious.
COMPLETE FRONTEND IMPLEMENTATION ROADMAP (No Code)
PHASE 1 – Project setup

Goal: Initialize Vite + React + Tailwind + routing + lint baseline.
Components: none
Pages: none
Hooks: none
State: none
API calls: none
Data flow: none
UI design: define theme tokens, typography, spacing scale
Files to create: package.json, vite.config, tailwind.config, src/main, src/styles, .env
PHASE 2 – Folder structure

Goal: Establish scalable structure.
Components: layout shell, UI primitives folder
Pages: placeholders
Hooks: useAuth, useApi
State: context skeleton
API calls: none
Data flow: top-level app → router → layout
UI design: define design system primitives
Files to create: src/pages, src/components, src/hooks, src/api, src/store, src/utils, src/routes
PHASE 3 – Authentication pages

Goal: Login, signup, forgot/reset password flows.
Components: AuthCard, FormField, PasswordStrength, AuthLayout
Pages: Login, Signup, ForgotPassword, ResetPassword
Hooks: useAuthForm, useToast
State: local form state, auth context set on success
API calls: /api/auth/login, /signup, /forgot-password, /reset-password
Data flow: form → validate (Zod) → API → auth state
UI design: clean, minimal, strong CTA hierarchy
Files to create: pages + auth form components + zod schemas
PHASE 4 – Protected routing

Goal: Guard routes and handle refresh flow.
Components: ProtectedRoute, AuthGate
Pages: none
Hooks: useAuth, useRefreshToken
State: auth tokens + user
API calls: /api/auth/refresh
Data flow: route entry → token check → refresh if needed
UI design: full-page loader for auth gating
Files to create: route guards, auth provider
PHASE 5 – Dashboard

Goal: List user URLs and quick actions.
Components: UrlTable, UrlRow, CopyButton, QrPreview
Pages: Dashboard
Hooks: useUrls
State: urls list + filters
API calls: /api/urls
Data flow: dashboard load → fetch → table
UI design: data-rich but clean, sortable list
Files to create: dashboard page + table components
PHASE 6 – Create short URL

Goal: Form to create new URL.
Components: CreateUrlForm, ExpiryPicker, AliasField
Pages: CreateUrl
Hooks: useCreateUrl
State: form state, result state
API calls: /api/urls
Data flow: form → API → show result/QR
UI design: focus on confidence and safety feedback
Files to create: page + form + zod schema
PHASE 7 – QR Code display

Goal: Show QR from create and list views.
Components: QrModal, QrCard
Pages: none
Hooks: useQr
State: selected QR data URL
API calls: none (uses response data)
Data flow: create/list → QR modal
UI design: clear, download action
Files to create: QR components
PHASE 8 – Edit URL

Goal: Allow changing original URL or expiry.
Components: EditUrlForm
Pages: EditUrl
Hooks: useUrl, useUpdateUrl
State: current URL + form
API calls: /api/urls/:id (GET, PATCH)
Data flow: load → edit → update → success toast
UI design: cautious, warn about safety re-check
Files to create: edit page + zod schema
PHASE 9 – Delete URL

Goal: Safe delete confirmation.
Components: ConfirmDialog
Pages: none
Hooks: useDeleteUrl
State: modal open + selected id
API calls: /api/urls/:id (DELETE)
Data flow: click delete → confirm → API → list refresh
UI design: destructive emphasis
Files to create: dialog component
PHASE 10 – Analytics dashboard

Goal: Overview metrics + recent visits.
Components: AnalyticsSummary, RecentVisitsTable
Pages: Analytics
Hooks: useAnalyticsSummary, useVisits
State: date range + pagination
API calls: /api/urls/:id/analytics, /api/urls/:id/visits
Data flow: select URL → fetch → render
UI design: metric cards + table grid
Files to create: analytics page + hooks
PHASE 11 – Browser analytics charts

Goal: Browser distribution chart.
Components: BrowserChart
Pages: embedded in analytics
Hooks: useBrowserAnalytics
State: date range
API calls: /api/urls/:id/browsers
Data flow: range → fetch → chart
UI design: clean segmented chart
Files to create: chart component
PHASE 12 – Device analytics charts

Goal: Device distribution chart.
Components: DeviceChart
Pages: embedded in analytics
Hooks: useDeviceAnalytics
State: date range
API calls: /api/urls/:id/devices
Data flow: range → fetch → chart
UI design: icon-driven labels
Files to create: chart component
PHASE 13 – Daily trend charts (Recharts)

Goal: Time-series click trends.
Components: DailyTrendsChart
Pages: embedded in analytics
Hooks: useDailyTrends
State: date range
API calls: /api/urls/:id/trends
Data flow: range → fetch → chart
UI design: minimal grid, clear legend
Files to create: chart component
PHASE 14 – Public stats page

Goal: Public stats by short code.
Components: PublicStatsCard, PublicTrendsChart
Pages: PublicStats
Hooks: usePublicStats
State: shortCode input / route param
API calls: /stats/:shortCode
Data flow: load → fetch → render
UI design: shareable, light branding
Files to create: page + hook
PHASE 15 – Bulk CSV upload (PapaParse)

Goal: Bulk import URLs.
Components: BulkUploadForm, UploadTable, UploadResults
Pages: BulkUpload
Hooks: useBulkUpload
State: parsed rows, file size, upload results
API calls: /api/urls/bulk
Data flow: parse → validate → upload → report
UI design: progress + success/fail visuals
Files to create: bulk page + parser util
PHASE 16 – Responsive UI

Goal: Mobile and tablet support.
Components: responsive nav, drawers
Pages: all
Hooks: useMedia
State: layout state
API calls: none
Data flow: breakpoints → layout changes
UI design: flexible cards and stack tables
Files to create: layout variants
PHASE 17 – Error handling

Goal: Standardize API errors.
Components: ErrorState, InlineError
Pages: all
Hooks: useApiError
State: error map per form/endpoint
API calls: all
Data flow: API error → mapping → UI
UI design: clear, non-blocking messaging
Files to create: error utilities
PHASE 18 – Loading states

Goal: Smooth UX during data fetch.
Components: Skeleton, Spinner, ButtonLoading
Pages: all
Hooks: useLoading
State: per-request loading flags
API calls: all
Data flow: request → loading → render
UI design: consistent placeholders
Files to create: loading components
PHASE 19 – Deployment

Goal: Build + deploy config.
Components: none
Pages: none
Hooks: none
State: none
API calls: none
Data flow: build → deploy
UI design: ensure base URL env strategy
Files to create: .env.production, deployment docs
