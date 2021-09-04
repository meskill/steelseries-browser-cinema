import { GameSenseEvent } from './types';
import { GAME_NAME, EVENT_FULLSCREEN_NAME } from './constants/steelseries';

type Events = typeof EVENT_FULLSCREEN_NAME;
export type FullScreenEvent = GameSenseEvent<typeof GAME_NAME, Events>;

export const createFullScreenEvent = (): FullScreenEvent => {
	return {
		game: GAME_NAME,
		event: EVENT_FULLSCREEN_NAME,
		data: {
			value: 1,
		},
	};
};
