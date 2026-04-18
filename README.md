# 📖 Odin Blog — Public Site

🔗 **Live Demo:** https://odin-blog-api-public.onrender.com
🔗 **Backend Repo:** https://github.com/curreesan/odin-blog-api-backend  
🔗 **Author Dashboard Repo:** https://github.com/curreesan/odin-blog-api-author

---

## 📌 Overview

The **Public Site** is a frontend application built for reading and interacting with blog posts in the Odin Blog API project. It allows anyone to browse published posts, and logged-in users to leave, edit, and delete comments.

This app works alongside the backend API and the author dashboard to form a complete full-stack blog platform.

---

## ✨ Features

- 📰 **Browse all published posts**
- 📄 **Read full post with comments**
- 🔐 **Authentication (JWT-based)**
  - Sign up for a new account
  - Login / Logout
- 💬 **Comment system**
  - Add comments on posts (logged in users)
  - Edit your own comments
  - Delete your own comments
  - Post authors can delete any comment on their posts
- ✍️ **Become an Author**
  - Upgrade your account to author status
  - Link to the author dashboard to start writing

---

## 🧱 Tech Stack

### Frontend

- React (Vite)
- React Router
- Context API (Auth management)
- Fetch API
- Plain CSS

### Backend (Connected API)

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT Authentication

---

### Environment Variables

Create a `.env` file in the root:

```
VITE_API_URL=https://odin-blog-api-backend.onrender.com
```

---

## 📄 Pages

| Page          | Path             | Access | Description                |
| ------------- | ---------------- | ------ | -------------------------- |
| Home          | `/`              | Public | Browse all published posts |
| Post          | `/posts/:id`     | Public | Read full post + comments  |
| Login         | `/login`         | Public | Login to your account      |
| Signup        | `/signup`        | Public | Create a new account       |
| Become Author | `/become-author` | Public | Upgrade to author role     |

---

## 🔗 Related Projects

| Project                                                               | Description                      |
| --------------------------------------------------------------------- | -------------------------------- |
| [Backend API](https://github.com/curreesan/odin-blog-api-backend)     | REST API powering both frontends |
| [Author Dashboard](https://github.com/curreesan/odin-blog-api-author) | Frontend for managing posts      |
