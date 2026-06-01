# URL Management Module

## Purpose
The URL Management Module provides the core capability to create, store, and manage short links for authenticated users. It solves the business need of turning long URLs into short, shareable links while ensuring each link belongs to a specific user and can be safely managed at scale.

## Responsibilities
- URL Creation: Accept a long URL and produce a unique short code.
- URL Ownership: Associate each URL record with a specific user.
- URL Retrieval: Allow users to list and fetch only their own URLs.
- URL Deletion: Enable users to remove links they own.
- URL Validation: Reject malformed URLs and invalid custom aliases early.

## Architecture Overview
Routes
→ Controllers
→ Services
→ Models

This separation ensures:
- Routes define HTTP boundaries and middleware composition.
- Controllers translate HTTP concerns into business calls.
- Services encapsulate business rules and database orchestration.
- Models define persistence structure and indexes.

The result is a modular design that is testable, secure, and easy to extend.

## Database Design
- ownerId
  - Why it exists: Links URLs to a specific user.
  - Business purpose: Enforces ownership and user isolation.
  - Scalability considerations: Indexed for fast user-scoped queries.

- originalUrl
  - Why it exists: Stores the destination URL.
  - Business purpose: Redirect target and analytics context.
  - Scalability considerations: Stored as a string; validation occurs before persistence.

- shortCode
  - Why it exists: Unique identifier used in short URLs.
  - Business purpose: Powers redirection and sharing.
  - Scalability considerations: Unique index ensures fast lookup and conflict prevention.

- clickCount
  - Why it exists: Tracks total clicks for analytics.
  - Business purpose: Enables basic usage metrics.
  - Scalability considerations: Can be incremented atomically; can be offloaded to analytics later.

- createdAt
  - Why it exists: Audit and lifecycle visibility.
  - Business purpose: Sorting and reporting.
  - Scalability considerations: Useful for pagination and archival policies.

- updatedAt
  - Why it exists: Tracks updates for auditing.
  - Business purpose: Detects modifications and supports data integrity.
  - Scalability considerations: Helps identify hot records.

- expiresAt
  - Why it exists: Optional link expiration.
  - Business purpose: Time-limited links and cleanup.
  - Scalability considerations: TTL index can auto-remove expired records.

## Index Strategy
- ownerId index
  - Improves user-scoped list and ownership checks.
- shortCode unique index
  - Enables fast redirect lookups and enforces uniqueness.
- expiresAt TTL index
  - Automatically removes expired links without manual jobs.
- Compound indexes
  - ownerId + createdAt supports ordered user listing at scale.

These indexes reduce query latency and keep lookups predictable as data grows.

## Short Code Generation Strategy
- Why nanoid: Compact, secure, and URL-safe random IDs.
- Length selection: 8 to 10 characters balances usability and collision risk.
- Entropy considerations: Enough randomness to keep collisions extremely rare at scale.
- Human readability: Short codes are easy to share, copy, and recognize.

## Collision Handling Strategy
- Automatic retries: Regenerate on collision up to a safe retry limit.
- Alias conflict handling: Custom alias conflicts return a clear 409 error.
- Why collisions are rare: nanoid entropy makes accidental collisions statistically negligible.

## Ownership Enforcement
- Why ownership matters: Prevents data leakage and unauthorized access.
- How unauthorized access is prevented: Queries are scoped by ownerId and checked in middleware.
- User isolation strategy: Every URL record is tied to a specific user, and all access is filtered by that owner.

## Validation Strategy
- URL validation: Ensure URL format and protocol are valid.
- Alias validation: Restrict to safe characters and length bounds.
- Input sanitization: Normalize and trim inputs before persistence.
- Error responses: Return structured validation errors with consistent messaging.

## API Design
POST /api/urls
- Purpose: Create a new short URL.
- Authentication requirements: Required.
- Request flow: Auth middleware → validation → controller → service → database → response.
- Response flow: URL record + short code returned on success.

GET /api/urls
- Purpose: List URLs belonging to the authenticated user.
- Authentication requirements: Required.
- Request flow: Auth middleware → controller → service → database → response.
- Response flow: User-scoped list returned.

GET /api/urls/:id
- Purpose: Retrieve a single URL owned by the user.
- Authentication requirements: Required.
- Request flow: Auth middleware → validation → ownership enforcement → controller → service → database → response.
- Response flow: Single URL record returned if owned.

DELETE /api/urls/:id
- Purpose: Delete a URL owned by the user.
- Authentication requirements: Required.
- Request flow: Auth middleware → validation → ownership enforcement → controller → service → database → response.
- Response flow: Deletion confirmation returned.

## Security Considerations
- JWT authentication: Ensures only authenticated users access URL endpoints.
- Ownership authorization: Prevents users from accessing others' URLs.
- Input validation: Blocks malformed URLs and unsafe aliases.
- Error handling: Consistent and safe error responses.
- Rate limiting relevance: Prevents abuse and brute-force creation attempts.

## Request Lifecycle
Create URL Flow
1) Client sends request with original URL and optional alias.
2) Auth middleware validates JWT.
3) Validation checks URL and alias.
4) Controller calls service.
5) Service generates short code and stores record.
6) Response returns created URL.

List URL Flow
1) Client requests list.
2) Auth middleware validates JWT.
3) Controller calls service.
4) Service queries by ownerId.
5) Response returns list.

Get URL Flow
1) Client requests URL by id.
2) Auth middleware validates JWT.
3) Validation checks id.
4) Ownership enforcement verifies ownerId.
5) Controller calls service.
6) Response returns record.

Delete URL Flow
1) Client requests delete by id.
2) Auth middleware validates JWT.
3) Validation checks id.
4) Ownership enforcement verifies ownerId.
5) Controller calls service.
6) Response confirms deletion.

## Interview Preparation
1) Why store ownerId?
   It guarantees every URL has a clear owner, enabling strong access control and user isolation.
2) Why nanoid?
   It produces short, URL-safe codes with high entropy and minimal collision risk.
3) Why unique shortCode index?
   It enforces uniqueness at the database level and speeds lookups.
4) Why use a service layer?
   It centralizes business logic and keeps controllers thin and testable.
5) Why validate URLs?
   It prevents storing invalid data and reduces downstream errors.
6) How do you prevent users from accessing other users' URLs?
   All queries are scoped by ownerId and enforced with ownership checks.
7) How would this scale to millions of URLs?
   Proper indexing, stateless services, and optional caching allow horizontal scaling.

## Future Enhancements
- Analytics integration: Track clicks, referrers, and geolocation.
- QR codes: Generate QR representations for each short link.
- Expiring links: Enforce time-limited sharing.
- Custom domains: Support branded short URLs.
- Redis caching: Cache hot links and analytics counters.
- Sharding strategy: Partition by ownerId or shortCode at scale.
