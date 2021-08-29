import { SteelSeriesApi } from './api';
import { EVENT_FULLSCREEN_NAME, GAME_NAME } from './constants';

const corePropPath =
	'file:///C:/ProgramData/SteelSeries/SteelSeries Engine 3/coreProps.json';

let address = '';

const readAddress = async (): Promise<string> => {
	return new Promise((resolve, reject) => {
		const handler: Parameters<chrome.tabs.TabUpdatedEvent['addListener']>[0] = (
			tabId,
			info
		) => {
			if (tabId && info.status === 'complete') {
				chrome.tabs.executeScript(
					tabId,
					{
						file: './readAddress.js',
						runAt: 'document_end',
					},
					(result) => {
						chrome.tabs.remove(tabId);

						if (result && result[0]) {
							resolve(result[0].address);
						} else {
							reject(`Cannot read from ${result}`);
						}

						chrome.tabs.onUpdated.removeListener(handler);
					}
				);
			}
		};

		chrome.tabs.onUpdated.addListener(handler);

		chrome.tabs.create({
			url: corePropPath,
			active: false,
		});
	});
};

chrome.runtime.onInstalled.addListener(async () => {
	address = await readAddress();

	const api = new SteelSeriesApi(address);

	await api.send('game_metadata', {
		game: GAME_NAME,
		game_display_name: 'Chromium',
		developer: 'meskill',
		deinitialize_timer_length_ms: 30000,
	});

	await api.send('register_game_event', {
		game: GAME_NAME,
		event: EVENT_FULLSCREEN_NAME,
		icon_id: 16,
	});

	console.log('done', address);
});

chrome.runtime.lastError;

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
	console.log('message...', address);
	if (address) {
		return sendResponse(address);
	}

	address = await readAddress();
	sendResponse(address);

	return true;
});
