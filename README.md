# E-Commerce API

RESTful API for an E-commerce application built with Node.js, Express.js, and MongoDB.

## Features

- Authentication & Authorization using JWT
- Refresh Token Authentication
- Product Management
- Category Management
- Shopping Cart
- Orders
- Online Payments with Stripe
- Security Middleware
  - Helmet
  - Rate Limiting
  - Data Sanitization
  - Compression

## Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Stripe
- joi validation
- multer
- nodemailer

## Installation

```bash
git clone https://github.com/mahmoud-Eng1/Nova-shop.git

cd api

npm install
```

## Environment Variables

Create a `.env` file:

```env
PORT=5000
URL_CONNECT_DB=your_database_uri
ACCESS_TOKEN_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_secret
STRIPE_SECRET_KEY=your_key
NODEMAILER_HOST=smtp.gmail.com
NODEMAILER_PORT=465
NODEMAILER_EMAIL=your_email@gmail.com
NODEMAILER_PASSWORD=your_app_password
```

## Run Project

```bash
npm run dev
```

## API Endpoints

### Authentication

- POST /api/v1/auth/register
- POST /api/v1/auth/login
- POST /api/v1/auth/refresh
- POST /api/v1/auth/logout
- POST /api/v1/auth/reset-password
- POST /api/v1/auth/verify-code
- POST /api/v1/auth/create-new-password

### Products

- GET /api/v1/products
- GET /api/v1/products/:id => get specific product
- POST /api/v1/products
- PATCH /api/v1/products/:id
- DELETE /api/v1/products/:id

### prand

- GET /api/v1/brand
- GET /api/v1/brand/:id => get specific brand
- POST /api/v1/brand
- PATCH /api/v1/brand/:id
- DELETE /api/v1/brand/:id


## Security

- JWT Authentication
- Refresh Token Rotation
- Rate Limiting
- Helmet
- Data Sanitization

## Author

Mahmoud Hussein