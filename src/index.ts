import express from "express";
import morgan from "morgan";
import cors from "cors";
import { routes } from "./routes/routes";
import "dotenv/config";

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(routes);

const PORT = process.env.PORT;

app.listen(PORT, () =>
  console.log(`Server is running at http://localhost:${PORT}`)
);
