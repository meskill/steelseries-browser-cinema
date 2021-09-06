import { SteelSeriesApi } from './api';
import { DEVELOPER } from './constants/info';
import { DISPLAY_GAME_NAME, EVENT_FULLSCREEN_NAME, GAME_NAME, STEEL_SERIES_CONFIG_PATH } from './constants/steelseries';
import { DEINITILIZE_TIMER } from './constants/timeouts';
import { writeAddressIntoStorage } from './storage';
import { CoreProps } from './types';

chrome.runtime.onInstalled.addListener(async () => {
	const tab = await chrome.tabs.create({
		url: STEEL_SERIES_CONFIG_PATH,
		active: false,
	});

	const handler: Parameters<chrome.tabs.TabUpdatedEvent['addListener']>[0] = async (tabId, info) => {
		if (tabId === tab.id && info.status === 'complete') {
			const [{ result }] = await chrome.scripting.executeScript({
				target: { tabId },
				files: ['readAddress.js'],
			});
			const { address } = result as CoreProps;

			await writeAddressIntoStorage(address);

			const api = new SteelSeriesApi(address);

			await api.send('game_metadata', {
				game: GAME_NAME,
				game_display_name: DISPLAY_GAME_NAME,
				developer: DEVELOPER,
				deinitialize_timer_length_ms: DEINITILIZE_TIMER,
			});

			await api.send('register_game_event', {
				game: GAME_NAME,
				icon_id: 16,
				event: EVENT_FULLSCREEN_NAME,
			});

			chrome.tabs.onUpdated.removeListener(handler);
			chrome.tabs.remove(tabId);
		}
	};

	chrome.tabs.onUpdated.addListener(handler);
});
