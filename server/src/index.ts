import express, { Request, Response } from "express";
import cors from "cors";
import { restaurantRouter } from "./routes/restaurant.routes";
const PORT = 8000;

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", async (req: Request, res: Response) => {
  res.send("Perfect Health").status(200);
});

app.use("/api/v1/restaurant", restaurantRouter);

app.listen(PORT, () => {
  console.log("Server is up and running at:", `http://localhost:${PORT}`);
});
