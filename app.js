import express from "express";
import dbConnect from "./dbConnect.js";
import getAccessToken from "./getAccessToken.js";
import pushCharacters from "./pushCharacters.js";
import pullCharacters from "./pullCharacters.js";
import verifySecretCode from "./verifySecretCode.js";
import everyminute from "./everyMinute.js";
import cron from "node-cron";
import cors from "cors";

const app = express();
const port = 4000;
dbConnect();
app.use(cors());
app.use(express.json());

const task = cron.schedule("0 * * * * *", () => {
  console.log(`data updated!,${new Date()} `);
  everyminute();
});

app.post("/characters", verifySecretCode, getAccessToken, pushCharacters, (req, res) => {
  res.json({
    msg: "done",
    characterNames: req.characterNames,
  });
});

app.get("/characterInfos", pullCharacters, (req, res) => {
  console.log("all data sended");
  res.json({ success: true, characterInfos: req.characters });
});

app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Page Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
});

app.listen(port, () => {
  task.start();
  console.log(`Example app listening on port ${port}`);
});
