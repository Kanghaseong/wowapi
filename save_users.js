import User from "./Models/user_model.js";
import axios from "axios";

export default async function save_users(req, res, next) {
  try {
    const users = req.body.users;
    console.log(users);
    console.log(req.token.access_token);
    const accessToken = req.token.access_token;
    const user_names = []; // 이 부분을 다시 추가했습니다.

    for (const user of users) {
      console.log(user);
      const encoded_user_name = encodeURIComponent(user);
      console.log(encoded_user_name);
      try {
        const response = await axios.get(
          `https://kr.api.blizzard.com/profile/wow/character/makgora/${encoded_user_name}?namespace=profile-classic1x-kr&locale=ko_KR&access_token=${accessToken}`
        );

        const { gender, race, name, faction, character_class, realm, guild, level, experience, last_login_timestamp, is_ghost } =
          response.data;

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

        user_names.push(new_user.name); // 이 부분을 다시 추가했습니다.
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log(`User ${user} not found.`);
          await User.findOneAndUpdate(
            { name: user }, // 찾을 조건
            { is_fully_dead: true } // 업데이트할 데이터
          );
        } else {
          console.log("An error occurred:", error);
        }
      }
    }

    req.user_names = user_names; // 다시 추가했습니다.
    next(); // 다음 미들웨어나 라우터 핸들러를 호출합니다.
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
}
