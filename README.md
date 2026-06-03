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
