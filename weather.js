#!/usr/bin/env node
import { getArgs } from './helpers/args.js';
import { getWeather } from './services/api.service.js';
import { printHelp, printSuccess, printError } from './services/log.service.js';
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

const initCLI = () => {
	const args = getArgs(process.argv);
	
	if (args.h) {
		printHelp();
	}
	if (args.s) {
		return saveKeyValue(STORAGE_KEYS.city, args.s)
	}
	if (args.t) {
		return saveToken(args.t);
	}
	
	getKeyValue(STORAGE_KEYS.city)
		.then((city) => {
			getWeather(city)
		})
};

initCLI();