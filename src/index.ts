import express from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./routes/hall";

const app = express();
const port = process.env.PORT || "8000";
app.use(express.json());
app.use(helmet());

const corsOptions = {
  origin: "https://oasis-zeta-orpin.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "X-Requested-With",
    "X-CSRF-Token",
    "Cache-Control",
    "Range",
  ],
};
app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/halls", router);

try {
  app.listen(port);
  console.log(`Server is listening on ${port}`);
} catch (err) {
  console.error(err);
}
