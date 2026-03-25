# Full Stack E-Commerce Store

![Node.js](https://img.shields.io/badge/Node.js-green?style=flat-square)
![Express](https://img.shields.io/badge/Express-grey?style=flat-square)
![React](https://img.shields.io/badge/React-blue?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat-square)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green)

A full stack e-commerce web app built with Node.js, Express, React, and PostgreSQL. Supports guest and authenticated shopping, an admin product management panel, cart persistence, and paginated product browsing with category filtering.

---

## Features

* Guest cart stored in localStorage, merged into DB on login
* JWT authentication with role-based access (user / admin)
* Product browsing with pagination and category filtering
* Admin dashboard — add, edit, delete products with image upload
* Cart — add, remove, update quantity, checkout flow
* Persistent auth state via Zustand + localStorage

---

## How It Works

* User browses products (paginated, filterable by category)
* Guest users can add to cart — stored in localStorage
* On login, guest cart is automatically merged with their DB cart
* JWT token is issued on login and attached to all protected requests
* Admins can manage products through a protected dashboard
* Product images are uploaded and served as static files from the backend

---

## Tech Stack

**Frontend:** React + TypeScript, Zustand, PrimeReact, Mantine, React Router

**Backend:** Node.js, Express.js

**Database:** PostgreSQL (via node-postgres `pg`)

**Auth:** JWT (jsonwebtoken) + bcrypt

**File Upload:** Multer

**Other:** dotenv, uuid, express-validator

---

## Project Structure
```
├── app/                    # backend
│   ├── controllers/        # request/response logic
│   ├── models/             # database queries
│   ├── routes/             # express route definitions
│   ├── services/           # business logic layer
│   ├── middleware/         # auth, upload, validation
│   ├── util/               # db connection, mailer
│   └── app.js              # entry point
│
└── client/                 # frontend
    ├── src/
    │   ├── pages/          # route-level page components
    │   ├── components/     # reusable UI components
    │   ├── services/       # API call functions
    │   └── stores/         # Zustand state stores
    └── public/
        └── images/         # static assets (placeholder.jpg etc)
```

---

## Running the App

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

### 2. Set Up the Database

Create a PostgreSQL database and run your schema. Make sure the following tables exist:
```
users, products, carts, cart_items
```

For the category filter to work, ensure the `products` table has a `category` column:
```sql
ALTER TABLE products ADD COLUMN category VARCHAR(100);
```

### 3. Configure Environment Variables

Create a `.env` file in the `app/` folder:
```
DATABASE_URL=postgresql://user:password@localhost:5432/yourdbname
JWT_SECRET=your_jwt_secret_here
BCRYPT_ROUNDS=10
```

### 4. Run Backend
```bash
cd app
npm install
npm start
```

Backend runs on:
```
http://localhost:5000
```

### 5. Run Frontend
```bash
cd client
npm install
npm run dev
```

Frontend runs on:
```
http://localhost:5173
```

---

## API Overview

### Auth

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/auth/signup` | register a new user |
| POST | `/auth/login` | login, returns JWT |
| POST | `/auth/logout` | logout |

### Products

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/products` | — | fetch paginated products (supports `?page=&limit=&category=`) |
| GET | `/products/:id` | — | fetch single product |
| POST | `/products` | admin | add new product (multipart/form-data) |
| PUT | `/products/:id` | admin | update product |
| POST | `/products/admin/deleteProduct` | admin | delete product |

### Cart

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/cart` | user | fetch user's cart |
| POST | `/cart/addItem` | user | add item to cart |
| POST | `/cart/updateCart` | user | update entire cart |
| POST | `/cart/deleteCartItem` | user | remove single item |
| POST | `/cart/merge` | user | merge localStorage cart on login |
| POST | `/cart/checkout` | user | checkout (simulated) |

---

## Notes

* The checkout flow is currently simulated — no real payment processing
* Product images are stored in `app/uploads/` and served as static files
* Admin routes are protected by both `authMiddleware` and `adminMiddleware` — a user account with `role = 'admin'` in the database is required
* Cart total price is always recalculated server-side from live product prices — the frontend total is treated as optimistic only

### Seeding Dummy Products
```sql
INSERT INTO products (id, title, description, price, stock, image_url, category) VALUES
(gen_random_uuid(), 'Wireless Headphones', '...', 89.99, 14, NULL, 'electronics'),
-- add more as needed
```
