import { Prisma, PrismaClient } from "@prisma/client";
import express from "express";
import router from "./routes";
import UserRouter from "./user/routes";

const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(express.json());

app.use("/api", router);
app.use("/api/user", UserRouter);

app.listen(port, () =>
  console.log(`
🚀 Server ready at: http://localhost:${port}`)
);
