export const checkFileSchemeAccess = (): Promise<boolean> => {
	return new Promise((resolve) => {
		chrome.extension.isAllowedFileSchemeAccess(resolve);
	});
};
