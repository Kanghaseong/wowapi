import express from "express";
import { getToken } from "./oauthRequest.js";
import { fetchCharacterData } from "./fetchCharacterData.js";
import { connectDB } from "./dbConnect.js";
import Character from "./CharacterModel.js";
import Token from "./TokenModel.js";
import crypto from "crypto";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = 4000;

// MongoDB 연결
connectDB();

app.use(express.json());

app.get("/token", async (req, res) => {
  try {
    const tokenData = await getToken();

    // 기존에 저장된 토큰이 있는지 확인
    const existingToken = await Token.findOne({ sub: tokenData.sub });

    if (existingToken) {
      // 이미 존재하는 토큰이 있다면 메시지만 전송
      res.status(200).send("Token already exists in the database.");
    } else {
      // 존재하지 않는다면 새로 저장
      const newToken = new Token({
        accessToken: tokenData.access_token,
        expiresIn: tokenData.expires_in,
        tokenType: tokenData.token_type,
        sub: tokenData.sub,
      });
      await newToken.save();
      res.json(tokenData);
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.post("/fetch-characters", async (req, res) => {
  const { characterNames } = req.body;
  const tokenData = await getToken();
  const allData = {};

  for (const name of characterNames) {
    // 데이터베이스에서 캐릭터 검색
    let character = await Character.findOne({ name: name });

    if (character) {
      // 캐릭터가 이미 존재한다면, 그 정보를 allData에 저장
      allData[name] = character;
    } else {
      // 캐릭터 정보를 API에서 가져오기
      const data = await fetchCharacterData(name, tokenData.access_token);

      if (data) {
        // 데이터가 false가 아니라면
        allData[name] = {
          gender: data.gender.name,
          race: data.race.name,
          name: data.name,
          faction: data.faction.name,
          characterClass: data.character_class.name,
          realm: data.realm.name,
          guild: data.guild ? data.guild.name : null,
          level: data.level,
          experience: data.experience,
          last_login_timestamp: data.last_login_timestamp,
          is_ghost: data.is_ghost,
        };

        character = new Character(allData[name]);
        await character.save();
      } else {
        // data가 false일 경우, 이 부분이 실행됩니다.
        // 인스턴스를 생성하지 않고 다음 이터레이션으로 넘어갑니다.
        continue;
      }
    }
  }

  res.json(allData); //블리자드 캐릭터 프로필 api로 정보를 불러오기 실패한 캐릭터는 현재 생략됩니다. 추후 정보를 가져오지 못한
  //캐릭터를 명시하도록 구현해야합니다.
});

app.get("/oauth", async (req, res) => {

  const {authorizationCode, code}= req.query;
  console.log(req.query)

  if (authorizationCode) {
    try {

      const tokenResponse = await axios.post(
        "https://oauth.battle.net/oauth/token",
        {
          region: "kr",
          grant_type: "authorization_code",
          code: authorizationCode,
          redirect_uri: "http://localhost:4000/oauth",
          client_id: process.env.WOW_CLIENT_ID, 
          state: code
        }
      )

      const accessToken = tokenResponse.data.access_token;
      // 이제 이 액세스 토큰을 사용해서 필요한 작업을 수행합니다.
      res.send(`Access token 받음: ${accessToken}`);
    } catch (error) {
      //console.error("Error fetching access token:", error);
      res.status(500).send("Access token을 얻는데 실패했습니다.");
    }
  } else {
    res.status(400).send("Authorization code가 없습니다.");
  }
});

app.get("/", (req, res) => {
  const html = `
  <html>
    <body>
      <form action="http://localhost:4000/token" method="GET">
        <button type="submit">토큰 요청 보내기</button>
      </form>
    </body>
  </html>
`;
  console.log(typeof crypto.randomBytes(20).toString("hex"));
  res.send(html);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
