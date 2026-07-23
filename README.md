<div align="center">

<img src="https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white"/>
<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/>
<img src="https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white"/>
<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white"/>
<img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
<img src="https://img.shields.io/badge/JWT-Auth-8B5CF6?style=for-the-badge&logoColor=white"/>
<img src="https://img.shields.io/badge/Swagger-OpenAPI-85EA2D?style=for-the-badge&logo=swagger&logoColor=black"/>
<img src="https://img.shields.io/badge/Status-Complete-22C55E?style=for-the-badge"/>

<br/>

# FinTrack - Smart Personal Finance Management Platform 💸 

**A full-stack expense and income tracking platform with JWT-secured APIs, real-time analytics, and a glassmorphic dark UI.**

</div>

---

## Overview 🔭

Expense Tracker is a full-stack **personal finance management system** built to go beyond a simple CRUD app. It combines a Spring Boot REST API — secured end-to-end with JWT authentication — with a React dashboard that visualizes spending patterns in real time. Every number on screen, from category breakdowns to monthly trends, is computed live from actual transaction data, not mocked.

---

## Features ✨

- **JWT-based authentication** — register/login with BCrypt-hashed passwords, stateless token sessions
- **Full Expense & Income CRUD** — create, edit, delete, with server-side validation
- **Live Dashboard Analytics** — total income, expenses, savings, and category breakdown computed per month
- **Spending Trend Charts** — daily (1M), 6-month, and 1-year views plotted from real historical data
- **Search, Filter, Sort & Paginate** — dynamic query builder using JPA Specifications
- **Interactive API Docs** — full Swagger/OpenAPI UI with built-in JWT "Authorize" flow
- **Glassmorphic Dark UI** — custom date picker, gradient stat cards, and animated charts

---

## Architecture Overview 🧠

    User
     │
     ├── React Frontend (Client Layer)
     │     ├── Auth Context (JWT persistence)
     │     ├── Dashboard (Recharts visualizations)
     │     ├── Expense / Income Management
     │     └── Protected Routing
     │
     └── Spring Boot Backend (API Layer)
           ├── Security Filter Chain (JWT validation)
           ├── Auth & User Management
           ├── Expense / Income Models (MySQL)
           ├── Dashboard Aggregation Service
           ├── Specification-based Search Engine
           └── Global Exception Handling

---

## How It Works 🔬

| Step | Action |
|------|--------|
| 1 | User registers → password hashed with BCrypt → JWT issued |
| 2 | Token stored client-side → attached to every API request via Axios interceptor |
| 3 | `JwtAuthFilter` validates the token on each request → populates Spring Security context |
| 4 | User logs an expense/income → validated via Jakarta Bean Validation |
| 5 | Dashboard requests aggregated totals for the current month |
| 6 | Backend groups expenses by category using Java Streams (`groupingBy` + `summingDouble`) |
| 7 | Frontend renders totals, pie chart, and trend line from the returned JSON |
| 8 | Search/filter requests build a dynamic query via JPA `Specification` composition |

---

## Project Structure 🏗️

    expense-tracker-app/
    │
    ├── backend/
    │   ├── src/main/java/com/satwik/expense_tracker/
    │   │   ├── config/          # Security & OpenAPI configuration
    │   │   ├── controller/      # REST endpoints
    │   │   ├── dto/             # Request/response data contracts
    │   │   ├── entity/          # JPA entities (User, Expense, Income)
    │   │   ├── exception/       # Global exception handling
    │   │   ├── repository/      # Spring Data JPA repositories
    │   │   ├── security/        # JWT filter, util, user details
    │   │   └── service/         # Business logic layer
    │   └── pom.xml
    │
    ├── frontend/
    │   ├── src/
    │   │   ├── api/             # Axios client with JWT interceptor
    │   │   ├── components/      # Sidebar, Layout, DatePicker
    │   │   ├── context/         # Auth context provider
    │   │   ├── pages/           # Dashboard, Expenses, Income, Auth
    │   │   └── App.jsx          # Route definitions
    │   └── package.json
    │
    └── README.md

---

## Tech Stack 🛠️

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Backend** | Spring Boot 4 (Java 21) | REST API framework |
| **Security** | Spring Security + JWT (jjwt) | Stateless authentication |
| **ORM** | Hibernate / Spring Data JPA | Entity persistence & Specifications |
| **Database** | MySQL | Relational data store |
| **Docs** | springdoc-openapi (Swagger UI) | Live, interactive API documentation |
| **Frontend** | React 19 + Vite | UI framework & build tooling |
| **Styling** | Tailwind CSS v4 | Utility-first dark theme design |
| **Charts** | Recharts | Pie & area chart visualizations |
| **HTTP Client** | Axios | API communication with JWT interceptor |
| **Routing** | React Router | Client-side navigation & protected routes |

---

## API Capabilities 🤖

| Capability | Status | Description |
|-----------|--------|-------------|
| JWT Register/Login | ✅ Live | BCrypt password hashing, token issuance |
| Expense/Income CRUD | ✅ Live | Full create, read, update, delete with validation |
| Dashboard Analytics | ✅ Live | Monthly totals, category breakdown, recent transactions |
| Search & Pagination | ✅ Live | Dynamic filtering via JPA Specifications |
| Swagger Documentation | ✅ Live | Interactive docs at `/swagger-ui/index.html` |
| Monthly Budgets | 🚧 Planned | Set spending limits per category with progress tracking |
| Categories Management | 🚧 Planned | Dedicated category CRUD instead of free-text |

---

## Installation ⚙️

### Prerequisites

- Java 21+
- Node.js 18+
- MySQL 8+
- Maven (or use the included `mvnw` wrapper)

### 1. Clone the repository

    git clone https://github.com/satwiktelang18/expense-tracker.git
    cd expense-tracker

### 2. Backend setup

    cd backend

Create your local database:

    CREATE DATABASE expense_tracker;

Configure `src/main/resources/application.properties` (or set as environment variables):

    DATABASE_URL=jdbc:mysql://localhost:3306/expense_tracker
    DATABASE_USERNAME=root
    DATABASE_PASSWORD=your_password
    JWT_SECRET=your_secret_key

Run the backend:

    ./mvnw spring-boot:run

Backend runs on `http://localhost:8080`

### 3. Frontend setup

    cd frontend
    npm install
    npm run dev

Frontend runs on `http://localhost:5173`

---

## Usage ▶️

1. **Register** a new account at `/register`
2. **Log in** to receive your JWT session
3. **Add expenses/income** via the dashboard forms
4. View **real-time totals, category breakdown, and spending trends**
5. Use **Search & Filters** on the Expenses page to find specific transactions
6. Explore the full API via **Swagger UI** at `/swagger-ui/index.html`

---

## Security Highlights 🔐

- Passwords hashed with **BCrypt** — never stored or transmitted in plain text
- **Stateless JWT sessions** — no server-side session storage
- Custom `OncePerRequestFilter` validates tokens on every request
- CORS explicitly configured to only allow the deployed frontend origin
- Centralized **`@RestControllerAdvice`** exception handling for consistent error responses

---

# 💡 Why This Project?

Most portfolio expense trackers stop at basic CRUD. This one goes further — a real authentication system, server-side aggregation logic (not client-side math), a dynamic search engine built on JPA Specifications, and a UI that actually communicates data clearly through interactive charts.

Every backend decision was made with a reason: DTOs to prevent data leakage, a service layer to separate business logic from HTTP handling, and Specifications to avoid an explosion of repository methods. It's built to hold up under real interview questions, not just look good in a screenshot.

---

## Roadmap 🚀

- [x] JWT authentication with BCrypt password hashing
- [x] Full Expense & Income CRUD
- [x] Dashboard analytics with category breakdown
- [x] Spending trend charts (daily/monthly/yearly)
- [x] Search, filter, sort & pagination
- [x] Swagger/OpenAPI documentation
- [x] Dark, glassmorphic UI redesign
- [ ] Monthly budget tracking with progress bars
- [ ] Categories management page
- [ ] CSV export
- [ ] Deploy on Render + Vercel

---

## 👨‍💻 Author

**Satwik Telang**
