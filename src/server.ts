import express from "express";
import * as dotenv from "dotenv";

import routes from "./route";
import path from "path";

const app = express();

dotenv.config({ path: path.join(__dirname, "..", ".env") });
const PORT = process.env.PORT || 5000;
app.use(express.json());

app.use("/api/v1", routes);

//AWS Container Health check route
app.get("/health", (req, res) => {
  return res.status(200).json({ message: "Everything is good!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
