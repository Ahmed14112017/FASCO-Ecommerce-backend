import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes";
import productRoutes from "./modules/products/product.routes";
import cartRoutes from "./modules/cart/cart.routes";
import orderRoutes from "./modules/orders/order.routes";
import categoryRoutes from "./modules/categories/category.routes";
import paymobRoutes from "./modules/paymob/routes";
import userRoutes from "./modules/user/user.routes";
import wishlistRoutes from "./modules/wishlist/wishlist.routes";

// import stripeRoutes from "./modules/stripe/stripe.routes";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/paymob", paymobRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wishlist", wishlistRoutes);

// app.use("/api/stripe/webhook", express.raw({ type: "application/json" }));
// app.use("/api/stripe", stripeRoutes);

export default app;
