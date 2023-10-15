import Character from "./Models/CharacterModel.js";

export default async function pullCharacters(req, res, next) {
  try {
    const characters = await Character.find({});
    req.characters = characters;
    next();
  } catch (error) {
    console.error("데이터를 불러오는 데 실패했습니다:");
    next(error);
  }
}
