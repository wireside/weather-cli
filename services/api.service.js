import axios from 'axios';
import https from 'https';
import { getKeyValue, STORAGE_KEYS } from './storage.service.js';

const getWeather = async (city) => {
	const token = process.env.WEATHER_APP_TOKEN ?? await getKeyValue(STORAGE_KEYS.token);
	
	if (!token) {
		throw new Error('Не задан ключ API, задайте его через команду -t [API_KEY]');
	}
	
	const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
	
	const { data } = await axios.get(baseUrl, {
		params: {
			q: city,
			appid: token,
			lang: 'ru',
			units: 'metric',
		},
	});
	console.log(data);
	return data;
};

export { getWeather }