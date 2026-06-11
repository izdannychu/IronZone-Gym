# IronZone Gym Management System

Full-stack gym website built from `gym-website-prompt.md`: public landing page, plans, trainers, cart, checkout, user dashboard, admin dashboard, SQLite seed data, JWT auth, and REST APIs.

## Tech Stack

- Frontend: React 18, Vite 5, Tailwind CSS 3, react-router-dom, axios, lucide-react, react-hot-toast, Headless UI
- Backend: Node.js 20+, Express 4, better-sqlite3, bcryptjs, jsonwebtoken, express-validator
- Database: SQLite demo database with production-friendly schema

## Cai dat va chay

### Yeu cau

- Node.js >= 20
- npm >= 9

### 1. Cai dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### 2. Cau hinh moi truong

```bash
copy server\.env.example server\.env
copy client\.env.example client\.env
```

Update `server/.env` va thay `JWT_SECRET` bang mot chuoi bi mat dai hon 32 ky tu.

### 3. Khoi tao database

```bash
cd server
npm run seed
```

### 4. Chay development

Terminal 1:

```bash
cd server
npm run dev
```

Terminal 2:

```bash
cd client
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000/api/health

## Tai khoan demo

| Role | Email | Password |
|---|---|---|
| Admin | admin@ironzone.vn | admin123 |
| User | user1@example.com | password123 |

## API nhanh

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/plans`
- `GET /api/trainers`
- `GET /api/cart`
- `POST /api/orders`
- `GET /api/memberships/my`
- `GET /api/admin/stats`
- `GET /api/admin/members`
- `GET /api/admin/equipment`

## Cau truc

```text
client/   React + Vite + Tailwind frontend
server/   Express API + SQLite schema/seed
```
