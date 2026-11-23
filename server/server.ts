import "dotenv/config";
import express, { Request, Response, type NextFunction } from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import productRouter from "./routes/productRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import addressRouter from "./routes/addressRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import deliveryPartnerRouter from "./routes/deliveryPartnerRoutes.js";
import { stripeWebhook } from "./controllers/webhooks.js";

const app = express();

//Stripe Payment
app.post(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

// Middleware
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
  res.send("Server is Live!");
});

//Auth Router Use (For Authentication)
app.use("/api/auth", authRouter);
//Product Router Use (For Products API)
app.use("/api/products", productRouter);
//Upload Image Router Use (Upload Product Image)
app.use("/api/upload", uploadRouter);
//Orders Router Use (All type of api in order)
app.use("/api/orders", orderRouter);

// Set up the "/api/inngest" (recommended) routes with the serve handler
app.use("/api/inngest", serve({ client: inngest, functions }));

//Address Router Use (Addresses)
app.use("/api/addresses", addressRouter);
//Admin Router Use (Admin Control)
app.use("/api/admin", adminRouter);
//Delivery Partner Router (All About Delivery Partner)
app.use("/api/delivery", deliveryPartnerRouter);

//Error Handling
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  res.status(500).json({ message: error.message });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
