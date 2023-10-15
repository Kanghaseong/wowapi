import axios from 'axios';

export async function fetchCharacterData(characterName, accessToken) {
  const encodedCharacterName = encodeURIComponent(characterName);
  const response = await axios.get(
    `https://kr.api.blizzard.com/profile/wow/character/makgora/${encodedCharacterName}?namespace=profile-classic1x-kr&locale=ko_KR&access_token=${accessToken}`
  );
  return response.data;
}

export default async function getCharacterInfo(req, res, next) {
  try {
    const { characters } = req.body;
    const accessToken = req.token.access_token;

    const characterInfoArray = [];

    for (const characterName of characters) {
      const characterData = await fetchCharacterData(characterName, accessToken);
      characterInfoArray.push(characterData);
    }

    req.characterInfo = characterInfoArray;
    next();
  } catch (error) {
    console.error('Error in getCharacterInfo middleware:', error);
    res.status(500).send('Internal Server Error');
  }
}
