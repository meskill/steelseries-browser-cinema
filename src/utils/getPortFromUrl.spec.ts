import { getPortFromUrl } from './getPortFromUrl';

describe('utils/getPortFromUrl', () => {
	it('test', () => {
		expect(getPortFromUrl('http://localhost:8663')).toBe(8663);
	});
});
