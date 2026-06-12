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

## Deploy production

Frontend va backend phai duoc deploy rieng. Vercel chi host React client, khong tu chay Express API trong thu muc `server`.

### 1. Deploy backend tren Render

Repository da co file `render.yaml`.

1. Vao Render, chon **New > Blueprint** va ket noi repository.
2. Render se tao service `ironzone-api` tu thu muc `server`.
3. Dat bien moi truong `CLIENT_URL` thanh domain frontend, vi du:

```text
https://iron-zone-gym.vercel.app
```

4. Sau khi deploy, kiem tra:

```text
https://<render-service>.onrender.com/api/health
```

### 2. Ket noi frontend Vercel

Trong Vercel Project Settings > Environment Variables, dat:

```text
VITE_API_URL=https://<render-service>.onrender.com/api
```

Khong su dung URL mau `https://your-api.onrender.com/api`.

Sau khi sua environment variable, phai redeploy frontend de Vite dua URL moi vao production bundle.

Vercel project nen co:

```text
Root Directory: client
Build Command: npm run build
Output Directory: dist
```

Luu y: SQLite tren Render free filesystem co the bi reset khi service duoc deploy lai. Cau hinh hien tai phu hop demo/do an; production lau dai nen dung PostgreSQL hoac persistent disk.
