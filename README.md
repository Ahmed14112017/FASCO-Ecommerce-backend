FASCO E-Commerce Backend
A RESTful API backend for the FASCO e-commerce platform, built with Node.js, Express, TypeScript, and MongoDB.
Tech Stack

Runtime: Node.js
Framework: Express.js v5
Language: TypeScript
Database: MongoDB with Mongoose
Authentication: JWT (Access & Refresh Tokens) + bcrypt
Email: Nodemailer
Payment: Paymob integration
Other: Cookie Parser, CORS, dotenv

Features

🔐 JWT-based authentication with httpOnly cookies
👤 User management & profiles
🛍️ Product management
🗂️ Category management
🛒 Cart functionality
❤️ Wishlist functionality
📦 Order management
💳 Paymob payment integration
📧 Email notifications via Nodemailer

API Endpoints
ModuleBase RouteAuth/api/authUsers/api/usersProducts/api/productsCategories/api/categoriesCart/api/cartWishlist/api/wishlistOrders/api/ordersPaymob/api/paymob
Getting Started
Prerequisites

Node.js 18+
MongoDB database (e.g. MongoDB Atlas)

Installation

git clone https://github.com/Ahmed14112017/fasco-backend.git
cd fasco-backend
npm install

Environment Variables

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
PAYMOB_API_KEY=your_paymob_api_key
CLIENT_URL=http://localhost:3000

Running the App

# Development

npm run dev

# Production build

npm run build
npm start

Project Structure

src/
├── modules/
│ ├── auth/
│ ├── user/
│ ├── products/
│ ├── categories/
│ ├── cart/
│ ├── wishlist/
│ ├── orders/
│ └── paymob/
└── server.ts
