import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import app from "./app";

import "./config/mail";
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
