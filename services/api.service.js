import axios from 'axios';
import https from 'https';
import { getKeyValue, STORAGE_KEYS } from './storage.service.js';

const getIcon = (icon) => {
	switch (icon.slice(0, -1)) {
		case '01':
			return '☀️';
		case '02':
			return '🌤️';
		case '03':
			return '☁️';
		case '04':
			return '☁️';
		case '09':
			return '🌧️';
		case '10':
			return '🌦️';
		case '11':
			return '🌩️';
		case '13':
			return '❄️';
		case '50':
			return '🌫️';
	}
};

const getWeather = async (city) => {
	if (!city) {
		throw new Error('Неверно передан город');
	}
	
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
	
	return data;
};

export { getWeather, getIcon };