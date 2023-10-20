import express from "express";
import db_connect from "./db-connect.js";
import get_access_token from "./get_access_token.js";
import save_users from "./save_users.js";
import get_users from "./get_users.js";
import verify_secret_code from "./verify_secret_code.js";
import every_minute from "./every_minute.js";
import cron from "node-cron";
import cors from "cors";

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
  console.log("all data sended");
  res.json({ success: true, users: req.users });
});

// app.get("/ouath", (req, res) => {
//   console.log(req);
//   res.send("abcd");
// });

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
