import { STEEL_SERIES_CONFIG_PATH } from './constants/steelseries';

export const resolveSteelseriesAddress = (): Promise<string> => {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();

		xhr.open('GET', STEEL_SERIES_CONFIG_PATH);

		xhr.onload = () => {
			try {
				const config = JSON.parse(xhr.response);

				resolve(config.address);
			} catch (err) {
				reject(err);
			}
		};

		xhr.onerror = () => {
			reject(new Error('Failed to fetch config'));
		};

		xhr.send();
	});
};
