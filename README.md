# 🎬 MovieRama UI

MovieRama is a **React + Vite + TypeScript** frontend for a movie-sharing platform where users can:
- 👤 Register and log in
- 🎞️ Add and view movies
- 👍 Like or 👎 Hate movies
- 🧭 Sort and filter movie lists
- 🔐 React only once per movie, and retract/change votes

This app connects to a **Spring Boot backend** exposed on  
👉 `http://localhost:8080`

---

## 🚀 Tech Stack

| Category | Tech |
|-----------|------|
| Framework | [React 19](https://react.dev/) |
| Build Tool | [Vite 5](https://vitejs.dev/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| State | [Redux Toolkit & RTK Query](https://redux-toolkit.js.org/) |
| Router | [React Router v6](https://reactrouter.com/en/main) |
| UI | [Bulma CSS](https://bulma.io/) |
| HTTP Client | [Axios](https://axios-http.com/) |

---

## 🧩 Prerequisites

Before running locally or in Docker:

- Node.js **v18.6.0+**
- npm **v10+**
- A running backend (Spring Boot) at **http://localhost:8080** (clone the api repo and run docker compose up inside the movierama folder)

---

## ⚙️ Environment Setup (Optional)

Create a `.env` file in the project root:

```bash
VITE_API_URL=http://localhost:8080/api
```

## ⚙️ Running Instructions

```bash
npm run dev
```