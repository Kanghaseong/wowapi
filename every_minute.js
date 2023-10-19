import axios from "axios";
import dotenv from "dotenv";
import Character from "./Models/user_model.js";

dotenv.config();

export default async function everyminute() {
  const response1 = await axios.post(
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

  const characterData = await Character.find({}, "name");
  const characterNames = characterData.map((character) => character.name);

  const token = response1.data.access_token; //token
  console.log(token);
  for (const characterName of characterNames) {
    const encodedCharacterName = encodeURIComponent(characterName);
    try {
      const response2 = await axios.get(
        `https://kr.api.blizzard.com/profile/wow/character/makgora/${encodedCharacterName}?namespace=profile-classic1x-kr&locale=ko_KR&access_token=${token}`
      );
      const { gender, race, name, faction, character_class, realm, guild, level, experience, last_login_timestamp, is_ghost } =
        response2.data;

      const newCharacter = {
        gender: gender.name,
        race: race.name,
        name,
        faction: faction.name,
        character_class: character_class.name,
        realm: realm.name,
        guild: guild ? guild.name : null,
        level,
        experience,
        last_login_timestamp,
        is_ghost,
      };

      // 중복 확인 조건
      const conditions = { name };

      // 데이터베이스에 저장 또는 덮어쓰기
      await Character.findOneAndReplace(conditions, newCharacter, {
        upsert: true,
      });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log(`Character ${character} not found.`);
        await Character.findOneAndUpdate(
          { name: character }, // 찾을 조건
          { is_fully_dead: true } // 업데이트할 데이터
        );
      } else {
        console.log("An error occurred: 1", error);
      }
    }
  }
}
