import { SteelSeriesApi } from './api';
import { createFullScreenEvent } from './events';

(function () {
	let interval: number;
	let api: SteelSeriesApi;

	const sendFullscreen = () => {
		return api.send('game_event', createFullScreenEvent());
	};

	const handler = async () => {
		if (document.fullscreenElement) {
			sendFullscreen();

			interval = setInterval(() => {
				sendFullscreen();
			}, 28000);
		} else {
			clearInterval(interval);
		}
	};

	document.addEventListener('fullscreenchange', () => {
		if (!api) {
			chrome.runtime.sendMessage({ event: 'getAddress' }, (address) => {
				api = new SteelSeriesApi(address);

				handler();
			});
		} else {
			handler();
		}
	});
})();
