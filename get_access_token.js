import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export default async function get_access_token(req, res, next) {
  try {
    const response = await axios.post(
      "https://oauth.battle.net/token",
      new URLSearchParams({
        grant_type: "client_credentials",
      }),
      {
        auth: {
          username: `${process.env.WOW_CLIENT_ID}`,
          password: `${process.env.WOW_CLIENT_SECRET}`,
        },
      }
    );
    console.log("access token called");
    console.log(response.data);
    req.token = response.data;

    next();
  } catch (error) {
    console.error("Error fetching access token:", error);
    res.status(500).send("Internal Server Error");
  }
}
