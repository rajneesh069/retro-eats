import express from "express";
import cors from "cors";
import { restaurantRouter } from "./router/restaurant";
const PORT = 8000;

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1/restaurant", restaurantRouter);

app.listen(PORT, () => {
  console.log("Server is up and running at:", `http://localhost:${PORT}`);
});
