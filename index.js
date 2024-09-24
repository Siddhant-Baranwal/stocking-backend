import express from "express";
import cors from "cors";
const app = express();
const PORT = 5000;
import { authRoutes } from "./routes/authRoutes.js";
app.use(
  cors({
      origin: [process.env.FRONTEND_URL],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
  })
);
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", function (req, res) {
  res.send("server is up and running");
});

const server = app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
