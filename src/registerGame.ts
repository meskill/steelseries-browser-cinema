import { SteelSeriesApi } from './api';
import { DEVELOPER } from './constants/info';
import { DISPLAY_GAME_NAME, EVENT_FULLSCREEN_NAME, GAME_NAME } from './constants/steelseries';
import { DEINITILIZE_TIMER } from './constants/timeouts';

export const registerGame = async (api: SteelSeriesApi): Promise<void> => {
	await api.send('game_metadata', {
		game: GAME_NAME,
		game_display_name: DISPLAY_GAME_NAME,
		developer: DEVELOPER,
		deinitialize_timer_length_ms: DEINITILIZE_TIMER,
	});

	await api.send('register_game_event', {
		game: GAME_NAME,
		icon_id: 16,
		event: EVENT_FULLSCREEN_NAME,
	});
};
