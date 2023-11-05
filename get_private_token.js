import axios from "axios";

export default async function get_private_token(authorization_code) {
  try {
    const response = await axios.post("https://oauth.battle.net/oauth/token", null, {
      params: {
        region: "kr",
        code: authorization_code,
        grant_type: "authorization_code",
        redirect_uri: "http://localhost:4000/auth/redirect",
      },
      auth: {
        username: process.env.WOW_CLIENT_ID,
        password: process.env.WOW_CLIENT_SECRET,
      },
    });
    console.log("authorization_code : ", authorization_code);
    console.log("response object : ", response.data);

    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw error;
  }
}
