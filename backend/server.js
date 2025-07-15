import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/database.js";
import connectUploadcare from "./config/uploadcare.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// App Config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectUploadcare();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['https://center-uvelir.ru', 'http://localhost:4000'],
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API Endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (request, response) => {
    response.send("API working.")
});

app.listen(port, () => console.log("Server started on PORT: " + port));