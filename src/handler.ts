(function () {
	let address: string;
	let interval: number;

	const sendPost = (method: string, body: any) => {
		return fetch(`http://${address}/${method}`, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
			},
		});
	};

	const sendFullscreen = () => {
		return sendPost('game_event', {
			game: 'CHROMIUM',
			event: 'FULLSCREEN',
			data: {
				value: 1,
			},
		});
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
		if (!address) {
			chrome.runtime.sendMessage({ event: 'getAddress' }, (response) => {
				address = response;

				handler();
			});
		} else {
			handler();
		}
	});
})();
