import { getPortFromUrl } from './getPortFromUrl';

describe('utils/getPortFromUrl', () => {
	it('should retrieve port from URL', () => {
		expect(getPortFromUrl('http://localhost:8663')).toBe(8663);
	});
});
