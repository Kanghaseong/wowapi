import Character from "./Models/CharacterModel.js";
import axios from "axios";

export default async function pushCharacters(req, res, next) {
  try {
    const { characters } = req.body;
    const accessToken = req.token.access_token;
    console.log(characters);
    console.log(accessToken);

    const characterInfoArray = [];

    for (const character of characters) {
      const encodedCharacterName = encodeURIComponent(character);
      const response = await axios.get(
        `https://kr.api.blizzard.com/profile/wow/character/makgora/${encodedCharacterName}?namespace=profile-classic1x-kr&locale=ko_KR&access_token=${accessToken}`
      );

      const characterInfo = response.data;

      // 중복 확인 조건
      // MongoDB에 저장할 새로운 캐릭터 정보
      const newCharacter = {
        gender: characterInfo.gender.type,
        race: characterInfo.race.name,
        name: characterInfo.name,
        faction: characterInfo.faction.type,
        characterClass: characterInfo.character_class.name,
        realm: characterInfo.realm.name,
        guild: characterInfo.guild ? characterInfo.guild.name : null,
        level: characterInfo.level,
        experience: characterInfo.experience,
        last_login_timestamp: characterInfo.last_login_timestamp,
        is_ghost: characterInfo.is_ghost,
      };

      // 중복 확인 조건
      const conditions = { name: newCharacter.name };

      // 데이터베이스에 저장 또는 덮어쓰기
      await Character.findOneAndReplace(conditions, newCharacter, {
        upsert: true,
      });

      characterInfoArray.push(newCharacter);
    }
    console.log(characterInfoArray)
    req.characterInfoArrays = characterInfoArray; // 다음 미들웨어나 라우터 핸들러에서 사용할 수 있도록 요청 객체에 저장합니다.

    next(); // 다음 미들웨어나 라우터 핸들러를 호출합니다.
  } catch (error) {
    console.error("Error in setCharacter middleware:", error);
    res.status(500).send("Internal Server Error");
  }
}
