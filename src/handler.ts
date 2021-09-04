import { SteelSeriesApi } from './api';
import { FULLSCREEN_BACKGROUND_FETCH_INTERNAL } from './constants/timeouts';
import { createFullScreenEvent } from './events';
import { getAddressWithStorage, writeAddressIntoStorage } from './storage';

const getAddressWithIframe = () => {
	console.log('loading from iframe');
	return new Promise<string>((resolve) => {
		const iframe = document.createElement('iframe');

		iframe.style.display = 'none';
		iframe.src = chrome.runtime.getURL('iframe.html');

		const listener = ({ data, origin }: MessageEvent<string>) => {
			if (iframe.src.startsWith(origin)) {
				window.removeEventListener('message', listener);

				console.log('got from iframe', data);

				writeAddressIntoStorage(data);
				resolve(data);
			}
		};

		window.addEventListener('message', listener);

		document.body.appendChild(iframe);
	});
};

const resolveAddress = async () => {
	console.log('loading from storage');
	const fromStorage = await getAddressWithStorage();

	console.log('got from storage', fromStorage);

	if (fromStorage) {
		return fromStorage;
	}

	return getAddressWithIframe();
};

let interval: ReturnType<typeof setTimeout>;
let api: SteelSeriesApi;

const sendFullscreen = async () => {
	if (!api) {
		api = new SteelSeriesApi(await resolveAddress());
	}

	try {
		return api.send('game_event', createFullScreenEvent());
	} catch (err) {
		await getAddressWithIframe();
		sendFullscreen();
	}
};

document.addEventListener('fullscreenchange', async () => {
	if (document.fullscreenElement) {
		sendFullscreen();

		interval = setInterval(() => {
			sendFullscreen();
		}, FULLSCREEN_BACKGROUND_FETCH_INTERNAL);
	} else {
		clearInterval(interval);
	}
});
