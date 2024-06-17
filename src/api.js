// api.js
import axios from 'axios';

const API_URL = 'https://api.edamam.com/api/recipes/v2';
const APP_ID = 'bbc68f20';
const APP_KEY = 'e67203c959a23191ab483e7645267122';

export const fetchData = async (query) => {
  const url = `${API_URL}?q=${query}&type=public&app_id=${APP_ID}&app_key=${APP_KEY}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data: ', error);
    return [];
  }


};
