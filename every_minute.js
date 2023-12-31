import axios from "axios";
import dotenv from "dotenv";
import User from "./Models/user_model.js";

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

  const userData = await User.find({}, "name is_deleted");

  // userData => [{ _id: new ObjectId("65316b86cb220354823cd175"), name: '응안줘' }, ...]

  const userNames = userData.filter((user) => user.is_deleted !== true).map((user) => user.name);

  const token = response1.data.access_token; //token
  console.log(token);
  for (const userName of userNames) {
    const encodeduserName = encodeURIComponent(userName);

    try {
      const response2 = await axios.get(
        `https://kr.api.blizzard.com/profile/wow/character/makgora/${encodeduserName}?namespace=profile-classic1x-kr&locale=ko_KR&access_token=${token}`
      );
      const { gender, race, name, faction, character_class, realm, guild, level, experience, last_login_timestamp, is_ghost } =
        response2.data;

      const new_user = {
        gender: gender.name,
        race: race.name,
        name,
        faction: faction.name,
        user_class: character_class.name,
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
      await User.findOneAndReplace(conditions, new_user, {
        upsert: true,
      });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log(`Character ${userName} deleted from owner.`);
        await User.findOneAndUpdate(
          { name: userName }, // 찾을 조건
          { is_fully_dead: true, is_deleted: true } // 업데이트할 데이터
        );
      } else {
        console.log("An error occurred: 1", error);
      }
    }
  }
}
