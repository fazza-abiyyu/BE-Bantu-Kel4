## Struktur Projek
📦 project-root
│── 📂 src
│   │── 📂 config          # Konfigurasi (database, environment)
│   │   │── db.ts         # Koneksi database (Prisma/Mongoose
│   │
│   │── 📂 models         # Model database
│   │   │── user.model.ts # Model User (Mongoose/Prisma)
│   │
│   │── 📂 middleware     # Middleware untuk otentikasi, logging, dll.
│   │   │── auth.middleware.ts
│   │
│   │── 📂 controllers    # Logika bisnis dan handler API
│   │   │── auth.controller.ts
│   │   │── user.controller.ts
│   │
│   │── 📂 services       # Layanan bisnis (abstraksi dari model)
│   │   │── auth.service.ts
│   │   │── user.service.ts
│   │
│   │── 📂 routes         # Endpoint API
│   │   │── auth.routes.ts
│   │   │── user.routes.ts
│   │
│   │── 📂 utils          # Helper dan fungsi umum
│   │   │── jwt.ts        # Fungsi JWT
│   │
│   │── app.ts            # Inisialisasi Express
│   │── server.ts         # Menjalankan server
│
│── 📂 tests              # Unit dan integration tests
│
│── .env                  # Variabel environment
│── package.json          # Dependencies dan scripts
│── config.js             # Konfigurasi JavaScript
