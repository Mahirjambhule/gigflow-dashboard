# GigFlow - Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack. Designed with clean architecture, scalable code practices, and a highly professional user experience. 

## 🚀 Features
* **Role-Based Access Control:** Strict permission segregation between 'Admin' (full CRUD) and 'Sales User' (Read/Update only).
* **Smart Data Table:** Backend-driven pagination, multi-field filtering, and sorting.
* **Performance Optimization:** 500ms debounced search to minimize database queries.
* **Data Portability:** One-click CSV export functionality for all filtered table data.
* **Modern UI/UX:** Built with Tailwind v4, featuring a global Dark/Light mode toggle, fully responsive layouts, and reusable Modal components.
* **Security:** JWT-based authentication, BCrypt password hashing, and strictly protected React routes.

## 💻 Tech Stack
* **Frontend:** React.js, TypeScript, Tailwind CSS, React Hook Form + Zod, Context API.
* **Backend:** Node.js, Express.js, TypeScript, MongoDB + Mongoose, JWT.

---

## 🐳 Docker Setup (Recommended)
You can spin up the entire application (Database, Backend, Frontend) with a single command using Docker.

\`\`\`bash
# Run this command in the root directory
docker-compose up --build
\`\`\`
* Frontend will be available at: http://localhost:4173
* Backend API will be available at: http://localhost:5000

## 🛠️ Local Setup Instructions

### 1. Backend Setup
\`\`\`bash
cd backend
npm install
\`\`\`
1. Create a \`.env\` file in the backend directory based on \`.env.example\`.
2. Add your MongoDB URI and a secure JWT Secret.
\`\`\`bash
npm run dev
\`\`\`
*The server will start on http://localhost:5000*

### 2. Frontend Setup
\`\`\`bash
cd frontend
npm install
\`\`\`
1. Create a \`.env\` file in the frontend directory based on \`.env.example\`.
\`\`\`bash
npm run dev
\`\`\`
*The app will start on http://localhost:5173*

---

## 📚 API Documentation

### Authentication Base URL: `/api/auth`
| Method | Endpoint | Description | Payload |
|--------|----------|-------------|---------|
| POST | `/register` | Register a new user | `{ name, email, password, role }` |
| POST | `/login` | Authenticate user | `{ email, password }` |

### Leads Base URL: `/api/leads` (Requires Bearer Token)
| Method | Endpoint | Description | Query/Payload | Role |
|--------|----------|-------------|---------------|------|
| GET | `/` | Fetch all leads (paginated) | `?page=1&limit=10&search=&status=` | Any |
| GET | `/:id` | Fetch single lead details | URL Param: `id` | Any |
| POST | `/` | Create a new lead | `{ name, email, status, source }` | Any |
| PUT | `/:id` | Update an existing lead | `{ name, email, status, source }` | Any |
| DELETE | `/:id` | Delete a lead | URL Param: `id` | Admin |