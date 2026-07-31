import express from "express";
import cors from "cors";
import router from "./modules/auth/routes.js";

// export default function  () {
//   const app = express();
// //   app.use(express.json());
//   return app;
// }

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use("/me", router);

export default app;
