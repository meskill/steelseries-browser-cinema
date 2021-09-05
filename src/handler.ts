import { SteelSeriesApi } from './api';
import { GAME_NAME } from './constants/steelseries';
import { FULLSCREEN_BACKGROUND_FETCH_INTERNAL } from './constants/timeouts';
import { createFullScreenEvent } from './events';
import { getAddressWithStorage, writeAddressIntoStorage } from './storage';

const getAddressWithIframe = () => {
	return new Promise<string>((resolve) => {
		const iframe = document.createElement('iframe');

		iframe.style.display = 'none';
		iframe.src = chrome.runtime.getURL('iframe.html');

		const listener = ({ data, origin }: MessageEvent<string>) => {
			if (iframe.src.startsWith(origin)) {
				window.removeEventListener('message', listener);

				writeAddressIntoStorage(data);
				resolve(data);
			}
		};

		window.addEventListener('message', listener);

		document.body.appendChild(iframe);
	});
};

const resolveAddress = async () => {
	const fromStorage = await getAddressWithStorage();

	if (fromStorage) {
		return fromStorage;
	}

	return getAddressWithIframe();
};

let interval: ReturnType<typeof setTimeout>;
let api: SteelSeriesApi;

const reloadApi = async () => {
	api = new SteelSeriesApi(await resolveAddress());
};

const resolveApi = async () => {
	if (!api) {
		await reloadApi();
	}
};

const sendEvent = async (apiRequest: () => Promise<void>) => {
	await resolveApi();

	try {
		await apiRequest();
	} catch (err) {
		await reloadApi();
		await getAddressWithIframe();
		sendEvent(apiRequest);
	}
};

const sendFullscreen = () => {
	return sendEvent(() => api.send('game_event', createFullScreenEvent()));
};

document.addEventListener('fullscreenchange', async () => {
	if (document.fullscreenElement) {
		sendFullscreen();

		interval = setInterval(() => {
			sendFullscreen();
		}, FULLSCREEN_BACKGROUND_FETCH_INTERNAL);
	} else {
		clearInterval(interval);
		sendEvent(() => api.send('stop_game', { game: GAME_NAME }));
	}
});
