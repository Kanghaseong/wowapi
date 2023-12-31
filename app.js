import express from "express";
import db_connect from "./db-connect.js";
import get_access_token from "./get_access_token.js";
import save_users from "./save_users.js";
import get_users from "./get_users.js";
import verify_secret_code from "./verify_secret_code.js";
import every_minute from "./every_minute.js";
import get_private_token from "./get_private_token.js";
import cron from "node-cron";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const port = process.env.MY_PORT; //배포환경에서 포트번호는 환경변수에 담아야 하는건가?

db_connect();
const cors_options = {
  origin: ["https://i-love-wow-hardcore.vercel.app", "http://localhost:3000"],
};
app.use(cors(cors_options));
app.use(express.json());

const task = cron.schedule("0 * * * * *", () => {
  console.log(`data updated!,${new Date()} `);
  every_minute();
});

app.post("/users", verify_secret_code, get_access_token, save_users, (req, res) => {
  res.json({
    msg: "done",
    user_names: req.user_names,
  }); // 어드민 페이지에 결과값 출력하는 프론트앤드 코드 짜야함
});

app.get("/users", get_users, (req, res) => {
  let log_arr = [];
  for (const user of req.users) {
    log_arr.push(user.name);
  }
  console.log(`data : ${log_arr}, OK, ${new Date()}`);

  res.json({ success: true, users: req.users });
});

app.get("/auth/redirect", async (req, res) => {
  console.log("3 q ", req.query);
  console.log(`query : ${req.query.code}`);
  console.log(req.body);

  if (req.query.code) {
    try {
      const private_token = await get_private_token(req.query.code);
      console.log("private:", private_token);
      res.send("Success");
    } catch (error) {
      res.status(500).send("Error occurred");
    }
  } else {
    res.status(400).send("No code provided");
  }
});

app.get("/", (req, res) => {
  res.status(200).send("health check OK");
});

app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Page Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error : last route",
    error: err.message,
  });
});

app.listen(port, () => {
  task.start();
  console.log(`Example app listening on port ${port}`);
});
