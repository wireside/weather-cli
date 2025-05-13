#!/usr/bin/env node
import { AxiosError } from 'axios';
import { getArgs } from './helpers/args.js';
import { getIcon, getWeather } from './services/api.service.js';
import {
	printHelp,
	printSuccess,
	printError,
	printWeather,
} from './services/log.service.js';
import { getKeyValue, saveKeyValue, STORAGE_KEYS } from './services/storage.service.js';

const saveToken = async (token) => {
	if (!token.length) {
		printError('Не передан токен');
		return;
	}
	
	try {
		await saveKeyValue(STORAGE_KEYS.token, token);
		printSuccess('Token сохранён');
	} catch (e) {
		printError(e.message);
	}
};

const saveCity = async (city) => {
	if (!city.length) {
		printError('Не указан город');
		return;
	}
	
	try {
		await saveKeyValue(STORAGE_KEYS.city, city);
		printSuccess('Город сохранен');
	} catch (e) {
		printError(e.message);
	}
};

const getForcast = async () => {
	try {
		const city = process.env.WEATHER_APP_CITY ?? await getKeyValue(STORAGE_KEYS.city);
		const weather = await getWeather(city);
		
		printWeather(weather, getIcon(weather.weather[0].icon));
	} catch (e) {
		if (e instanceof AxiosError) {
			if (e.response.status === 404) {
				printError('Неверно указан город');
			} else if (e.response.status === 401) {
				printError('Неверно указан токен');
			} else {
				printError(`Ошибка API: ${e.message}`);
			}
		} else {
			printError(e.message);
		}
	}
};

const initCLI = () => {
	const args = getArgs(process.argv);
	
	if (args.h) {
		return printHelp();
	}
	if (args.s) {
		return saveCity(args.s);
	}
	if (args.t) {
		return saveToken(args.t);
	}
	
	return getForcast();
};

initCLI();