import { resolveSteelseriesAddress } from './steelseriesConfig';

resolveSteelseriesAddress().then((address) => {
	window.parent.postMessage(address, '*');
});
