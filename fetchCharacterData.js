import axios from 'axios';

export async function fetchCharacterData(characterName, token) {
  const encodedName = encodeURIComponent(characterName);
  const config = {
    method: 'get',
    url: `https://kr.api.blizzard.com/profile/wow/character/makgora/${encodedName}?namespace=profile-classic1x-kr&locale=ko_KR&access_token=${token}`,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    //console.error(error);
    return null;
  }
}
