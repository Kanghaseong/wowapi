import axios from 'axios';
import qs from 'qs';
import dotenv from 'dotenv';

dotenv.config();

export const getToken = async () => {
  const data = qs.stringify({
    'client_id': process.env.WOW_CLIENT_ID,
    'client_secret': process.env.WOW_CLIENT_SECRET,
    'grant_type': 'client_credentials'
  });

  const config = {
    method: 'post',
    url: 'https://oauth.battle.net/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
