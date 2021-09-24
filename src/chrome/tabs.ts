export const waitTabLoaded = async (tab: chrome.tabs.Tab): Promise<void> => {
	return new Promise<void>((resolve) => {
		const handler: Parameters<chrome.tabs.TabUpdatedEvent['addListener']>[0] = async (tabId, info) => {
			if (tabId === tab.id && info.status === 'complete') {
				chrome.tabs.onUpdated.removeListener(handler);

				resolve();
			}
		};

		chrome.tabs.onUpdated.addListener(handler);
	});
};

export const waitTabRemoved = async (tab: chrome.tabs.Tab): Promise<void> => {
	return new Promise<void>((resolve) => {
		const handler: Parameters<chrome.tabs.TabRemovedEvent['addListener']>[0] = async (tabId) => {
			if (tabId === tab.id) {
				chrome.tabs.onRemoved.removeListener(handler);

				resolve();
			}
		};

		chrome.tabs.onRemoved.addListener(handler);
	});
};
