# 📚 Library Decisions Specification
**Project**: Lynko URL Shortener Platform  

---

## 💻 Frontend Libraries

### 1. React & React Router DOM
- **Purpose**: Component rendering framework and routing engine.
- **Why Selected**: Vite-ready, fast Virtual DOM handling, and supports code splitting.
- **Usage in Lynko**: Renders the UI and manages routing gates (`/dashboard`, `/analytics`, etc.).
- **Alternatives Considered**: Vue (rejected due to more complex state sharing for charts).

### 2. Axios
- **Purpose**: Promise-based HTTP client.
- **Why Selected**: Simplifies setting up request/response interceptors to handle token refreshes automatically.
- **Usage in Lynko**: Manages API calls, appends authorization headers, and handles token rotation.
- **Alternatives Considered**: Browser Native Fetch (requires manual header injection and complex wrapper logic).

### 3. React Hook Form & Zod
- **Purpose**: Form handling and schema-based validation.
- **Why Selected**: Minimizes re-renders during input events and ensures robust, schema-based client-side validation.
- **Usage in Lynko**: Manages form inputs and validates email formats and custom alias parameters.
- **Alternatives Considered**: Formik + Yup (rejected due to larger bundle sizes and slower execution).

### 4. Recharts
- **Purpose**: SVG charting library.
- **Why Selected**: Integrates seamlessly with React, rendering responsive and customizable charts.
- **Usage in Lynko**: Visualizes browser, device, country, and traffic trends.
- **Alternatives Considered**: Chart.js (requires canvas wrappers, making responsive scaling less fluid).

### 5. Framer Motion
- **Purpose**: Layout transitions and animation library.
- **Why Selected**: Simplifies creating animations and transitions for modals and sidebars.
- **Usage in Lynko**: Coordinates navigation sidebar slides and page loading entries.
- **Alternatives Considered**: Raw CSS Transitions (more complex to coordinate across dynamic layout heights).

### 6. PapaParse
- **Purpose**: CSV parser.
- **Why Selected**: Processes large files in browser background threads to prevent main-thread freezing.
- **Usage in Lynko**: Parses user CSV spreadsheets during bulk shortening.
- **Alternatives Considered**: D3-dsv (larger footprint, less optimized for basic bulk imports).

---

## ⚙️ Backend Libraries

### 1. Express
- **Purpose**: Node.js web server.
- **Why Selected**: Modular, high performance, and lightweight.
- **Usage in Lynko**: Serves endpoints, parses parameters, and handles redirections.
- **Alternatives Considered**: Fastify (excellent speed, but Express has wider compatibility for middleware integrations).

### 2. Mongoose
- **Purpose**: MongoDB object modeling tool.
- **Why Selected**: Provides structured schemas, validation, and middleware hooks for MongoDB collections.
- **Usage in Lynko**: Defines collections (User, Url, Visit) and manages compound indexes.
- **Alternatives Considered**: Native MongoDB Driver (lacks built-in schema validations and relationship hooks).

### 3. bcrypt
- **Purpose**: Cryptographic password hashing.
- **Why Selected**: Enforces computationally expensive hashing (12 rounds) to protect passwords.
- **Usage in Lynko**: Hashes passwords on signup and validates them during login.
- **Alternatives Considered**: Argon2 (superior security, but bcrypt has wider compatibility across serverless environments).

### 4. jsonwebtoken (JWT)
- **Purpose**: Secure token signing.
- **Why Selected**: Lightweight, industry standard for stateless authentication.
- **Usage in Lynko**: Issues access and refresh tokens.
- **Alternatives Considered**: Cookies-sessions (lacks scalability for decoupled multi-origin APIs).

### 5. Helmet & CORS
- **Purpose**: Security headers and cross-origin controls.
- **Why Selected**: Quick protection against common web vulnerabilities and manages API access policies.
- **Usage in Lynko**: Secures HTTP response headers and controls API access origins.
- **Alternatives Considered**: Hand-coded header injection (prone to configuration gaps).
