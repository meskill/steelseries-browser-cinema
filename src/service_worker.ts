import { SteelSeriesApi } from './api';
import { waitTabLoaded } from './chrome/tabs';
import { GITHUB_URL } from './constants/info';
import { DISPLAY_GAME_NAME } from './constants/steelseries';
import { registerGame } from './registerGame';
import { resolveSteelseriesAddress } from './steelseriesConfig';
import { writeAddressIntoStorage } from './storage';
import { ExtensionMessageShowAlert } from './types';
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
						message: `In order to work, SteelSeries ${DISPLAY_GAME_NAME} Extension needs permission "Allow access to file URLs".
Please enable this permission on a new tab that will open after you click "OK" on this message`,
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

const registerGameWithConfig = async () => {
	const address = await resolveSteelseriesAddress();

	await writeAddressIntoStorage(address);

	const api = new SteelSeriesApi(address);

	await registerGame(api);
};

chrome.runtime.onInstalled.addListener(async () => {
	const hasFileSchemaAccess = await checkFileSchemeAccess();

	if (hasFileSchemaAccess) {
		await registerGameWithConfig();
	} else {
		await openInstructionsTab();
	}
});
