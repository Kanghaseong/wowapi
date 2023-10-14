import express from "express";
import dbConnect from "./dbConnect.js";
import getAccessToken from "./getAccessToken.js";
import saveToken from "./saveToken.js";
const app = express();
const port = 4000;
dbConnect();

app.use(express.json());  

app.get("/getAccessToken", getAccessToken, saveToken,  (req, res) => {
  res.json(req.token);
});

app.get("/", (req, res) => {
  res.send("hi");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
