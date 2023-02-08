import express from "express";
import morgan from "morgan";
import cors from "cors";
import { routes } from "./routes/routes";
import { errorMIddleware } from "./middlewares/errorHandler/error";
import "dotenv/config";

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

app.use(errorMIddleware);

const PORT = process.env.PORT;

app.listen(PORT, () =>
  console.log(`Server is running at http://localhost:${PORT}`)
);

export default app;