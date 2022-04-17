import { STEEL_SERIES_CONFIG_PATH } from './constants/steelseries';
import { CoreProps } from './types';

export const resolveSteelseriesAddress = async (): Promise<string> => {
	const response = await fetch(STEEL_SERIES_CONFIG_PATH);
	const config: CoreProps = await response.json();

	return config.address;
};
