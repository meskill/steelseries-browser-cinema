import { SteelSeriesApi } from './api';
import { waitTabLoaded } from './chrome/tabs';
import { GITHUB_URL } from './constants/info';
import { DISPLAY_GAME_NAME, STEEL_SERIES_CONFIG_PATH } from './constants/steelseries';
import { registerGame } from './registerGame';
import { writeAddressIntoStorage } from './storage';
import { CoreProps, ExtensionMessageShowAlert } from './types';
import { checkFileSchemeAccess } from './utils/checkFileSchemeAccess';

const openInstructionsTab = async () => {
	const instructionTab = await chrome.tabs.create({
		url: `${GITHUB_URL}#setup`,
	});

	if (instructionTab.id) {
		await waitTabLoaded(instructionTab);
		await new Promise<void>((resolve) => {
			if (instructionTab.id) {
				chrome.tabs.sendMessage<ExtensionMessageShowAlert['request']>(
					instructionTab.id,
					{
						type: 'showAlert',
						message: `In order to work SteelSeries ${DISPLAY_GAME_NAME} Extension needs "Allow access to file URLs" permission.
Please enable that permission on a new tab that will open after you click "OK" on this message`,
					},
					resolve
				);
			}
		});
	}

	const tab = await chrome.tabs.create({
		url: `chrome://extensions/?id=${chrome.runtime.id}`,
	});

	if (!tab.id) {
		throw new Error('Cannot open Extensions Settings Tab');
	}
};

const registerGameWithTab = async () => {
	const tab = await chrome.tabs.create({
		url: STEEL_SERIES_CONFIG_PATH,
		active: false,
	});

	if (!tab.id) {
		throw new Error('Cannot get STEEL_SERIES_CONFIG_PATH file');
	}

	await waitTabLoaded(tab);

	const [{ result }] = await chrome.scripting.executeScript({
		target: { tabId: tab.id },
		func: () => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			return JSON.parse(document.body?.firstChild?.innerText);
		},
	});
	const { address } = result as CoreProps;

	await writeAddressIntoStorage(address);

	const api = new SteelSeriesApi(address);

	await registerGame(api);

	chrome.tabs.remove(tab.id);
};

chrome.runtime.onInstalled.addListener(async () => {
	const hasFileSchemaAccess = await checkFileSchemeAccess();

	if (hasFileSchemaAccess) {
		await registerGameWithTab();
	} else {
		await openInstructionsTab();
	}
});
