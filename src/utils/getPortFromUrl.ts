export const getPortFromUrl = (address: string): number => {
	const match = address.match(/:(\d+)$/);

	if (!match) {
		throw new Error(`Cannot get port from address "${address}"`);
	}

	return +match[1];
};
