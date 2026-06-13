# IronZone Gym Management System

IronZone combines a modern gym floor, expert coaching, and online management tools so members can track their fitness journey with confidence.

## Tech Stack

- Frontend: React 18, Vite 5, Tailwind CSS 3, react-router-dom, axios, lucide-react, react-hot-toast, Headless UI
- Backend: Node.js 20+, Express 4, better-sqlite3, bcryptjs, jsonwebtoken, express-validator
- Database: SQLite demo database with production-friendly schema

## Installation and Setup

### Requirements

- Node.js >= 20
- npm >= 9

### 1. Install Dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### 2. Configure Environment Variables

```bash
copy server\.env.example server\.env
copy client\.env.example client\.env
```

Update `server/.env` and replace `JWT_SECRET` with a secure string longer than 32 characters.

### 3. Initialize the Database

```bash
cd server
npm run seed
```

### 4. Start the Development Servers

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

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@ironzone.vn | admin123 |
| User | user1@example.com | password123 |

## API Overview

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

## Project Structure

```text
client/   React + Vite + Tailwind frontend
server/   Express API + SQLite schema/seed
```

## Production Deployment

The frontend and backend must be deployed separately. Vercel only hosts the React client and does not run the Express API located in the `server` directory.

### 1. Deploy the Backend on Render

The repository already includes a `render.yaml` file.

1. Open Render, select **New > Blueprint**, and connect the repository.
2. Render will create the `ironzone-api` service from the `server` directory.
3. Set the `CLIENT_URL` environment variable to the frontend domain, for example:

```text
https://iron-zone-gym.vercel.app
```

4. After deployment, verify the API health endpoint:

```text
https://<render-service>.onrender.com/api/health
```

### 2. Connect the Vercel Frontend

In **Vercel Project Settings > Environment Variables**, set:

```text
VITE_API_URL=https://<render-service>.onrender.com/api
```

Do not use the placeholder URL `https://your-api.onrender.com/api`.

After changing the environment variable, redeploy the frontend so Vite can include the new URL in the production bundle.

The Vercel project should use:

```text
Root Directory: client
Build Command: npm run build
Output Directory: dist
```

Note: SQLite data stored on Render's free filesystem may be reset when the service is redeployed. The current setup is suitable for demonstrations and academic projects. For long-term production use, choose PostgreSQL or a persistent disk.
