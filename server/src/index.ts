import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
import authRoutes from "./routes/auth";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
