const corePropPath =
	'file:///C:/ProgramData/SteelSeries/SteelSeries Engine 3/coreProps.json';

let address = '';

const sendPost = (method: string, body: any) => {
	return fetch(`http://${address}/${method}`, {
		method: 'POST',
		body: JSON.stringify(body),
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
		},
	});
};

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

	await sendPost('game_metadata', {
		game: 'CHROMIUM',
		game_display_name: 'Chromium',
		developer: 'meskill',
		deinitialize_timer_length_ms: 30000,
	});

	await sendPost('register_game_event', {
		game: 'CHROMIUM',
		event: 'FULLSCREEN',
		icon_id: 16,
	});

	console.log('done', address);
});

chrome.runtime.lastError;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log('message...', address);
	if (address) {
		return sendResponse(address);
	}

	readAddress().then((newAddress) => {
		address = newAddress;
		sendResponse(address);
	});

	return true;
});
