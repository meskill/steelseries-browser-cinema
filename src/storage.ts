import { STEEL_SERIES_API_STORAGE_KEY } from './constants/steelseries';

export const getAddressWithStorage = async (): Promise<string | undefined> => {
	return new Promise<string>((resolve) => {
		chrome.storage.local.get(STEEL_SERIES_API_STORAGE_KEY, (result) => {
			resolve(result?.[STEEL_SERIES_API_STORAGE_KEY]);
		});
	});
};

export const writeAddressIntoStorage = async (address: string) => {
	await chrome.storage.local.set({
		[STEEL_SERIES_API_STORAGE_KEY]: address,
	});
};
