# AIRIS (Air Quality Monitoring System)

AIRIS adalah sistem monitoring kualitas udara berbasis IoT yang menggunakan ESP32 sebagai perangkat sensor dan website sebagai media monitoring secara real-time. Sistem ini juga mendukung notifikasi melalui Telegram Bot serta terdapat fitur rekomendasi tindakan dan kesehatan berbasis AI yang dikembangkan khusus untuk MTS Negeri 2 Malang.

---

# Tech Stack

## Frontend

* React
* Vite

## Backend

* Node.js
* Express.js
* Prisma ORM

## Database

* PostgreSQL
* InfluxDB

## Communication

* MQTT

## Deployment

* Docker
* Docker Compose

---

# Prerequisites

Pastikan perangkat telah terpasang:

* Git
* Node.js (v22 atau lebih baru)
* Docker Desktop
* Docker Compose

---

# Clone Repository

```bash
git clone https://github.com/nurshineds/airis-web.git
cd AIRIS
```

---

# Environment Configuration

Masuk ke folder backend:

```bash
cd backend
```

Salin file `.env.example` menjadi `.env`.

### Linux / macOS

```bash
cp .env.example .env
```

### Windows Command Prompt (CMD)

```cmd
copy .env.example .env
```

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

Setelah itu, sesuaikan nilai pada file `.env` sesuai dengan environment yang digunakan.

---

# Install Dependencies

## Backend

```bash
cd backend
npm install
```

## Frontend

```bash
cd ../frontend
npm install
```

---

# Start Docker Services

Dari root project:

```bash
docker compose up --build
```

Menjalankan di background:

```bash
docker compose up -d --build
```

Menghentikan container:

```bash
docker compose down
```

Menghapus container beserta volume:

```bash
docker compose down -v
```

---

# Prisma

Masuk ke folder backend:

```bash
cd backend
```

Generate Prisma Client:

```bash
npx prisma generate
```

Menjalankan migration:

```bash
npx prisma migrate dev --name init
```

Menjalankan seluruh migration pada environment deployment:

```bash
npx prisma migrate deploy
```

Membuka Prisma Studio:

```bash
npx prisma studio
```

---

# Seed Database

Jika project sudah memiliki file `prisma/seed.js`:

```bash
npx prisma db seed
```

---

# Run Application

## Backend

```bash
cd backend
npm run dev
```

Backend berjalan pada:

```text
http://localhost:5000
```

---

## Frontend

```bash
cd frontend
npm run dev
```

Frontend berjalan pada:

```text
http://localhost:5173
```

---

# Project Structure

```text
AIRIS/
│
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── prompts/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── frontend/
│
├── docker-compose.yml
│
└── README.md
```

---

# Development Workflow

1. Clone repository.
2. Salin `.env.example` menjadi `.env`.
3. Install dependency backend dan frontend.
4. Jalankan Docker Compose.
5. Generate Prisma Client.
6. Jalankan Prisma Migration.
7. Jalankan backend.
8. Jalankan frontend.

---

# Available Scripts

## Backend

Menjalankan development server:

```bash
npm run dev
```

Menjalankan production server:

```bash
npm start
```

Generate Prisma Client:

```bash
npx prisma generate
```

Membuat migration baru:

```bash
npx prisma migrate dev
```

Menjalankan migration pada deployment:

```bash
npx prisma migrate deploy
```

Membuka Prisma Studio:

```bash
npx prisma studio
```

---

# License

Project AIRIS dikembangkan sebagai sistem monitoring kualitas udara berbasis IoT.
