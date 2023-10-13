import express from 'express';
import { getToken } from './oauthRequest.js';
import { fetchCharacterData } from './fetchCharacterData.js';
import { connectDB } from './dbConnect.js';
import Character from './CharacterModel.js';

const app = express();
const port = 4000;

// MongoDB 연결
connectDB();

app.use(express.json());

app.get('/token', async (req, res) => {
  try {
    const tokenData = await getToken();
    res.json(tokenData);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

app.post('/fetch-characters', async (req, res) => {
  const { characterNames } = req.body;
  const tokenData = await getToken();
  const allData = {};

  for (const name of characterNames) {
    const data = await fetchCharacterData(name, tokenData.access_token);
    if (data) {
      allData[name] = data;

      const character = new Character({
        gender: data.gender.name,
        race: data.race.name,
        name: data.name,
        faction: data.faction.name,
        characterClass: data.character_class.name,
        realm: data.realm.name,
        guild: data.guild ? data.guild.name : null, // guild 정보가 없을 수 있으므로 null 체크
        level: data.level,
        experience: data.experience,
        last_login_timestamp: data.last_login_timestamp,
        is_ghost: data.is_ghost
      });
      await character.save();
    }
  }

  res.json(allData);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
