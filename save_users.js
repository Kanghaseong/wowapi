import User from "./Models/user_model.js";
import axios from "axios";

export default async function save_users(req, res, next) {
  try {
    const users = req.body.users;
    const accessToken = req.token.access_token;
    const user_names = [];

    for (const user of users) {
      const encoded_user_name = encodeURIComponent(user);

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

        user_names.push(new_user.name); // 유효한 이름은 배열에 저장.
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log(`User ${user} not found in blizzard character names api server.`);
          await User.findOneAndUpdate(
            { name: user }, // 찾을 조건
            { is_ghost: true } // 업데이트할 데이터
          );
        } else if (error.response && error.response.status === 403) {
          console.log(`blizzard server send 403 state code`);
        } else {
          console.log("An error occurred:", error);
        }
      }
    }

    req.user_names = user_names;
    console.log(`valid names is ${user_names}`);
    next();
  } catch (error) {
    console.log(error, "Internal Server Error : save");
    res.status(500).send("Internal Server Error : save");
  }
}
