export interface GameSenseBase<Game extends string = string> {
	game: Game;
}

export interface GameSenseDescription<Game extends string = string>
	extends GameSenseBase<Game> {
	game_display_name: string;
	developer: string;
	deinitialize_timer_length_ms?: number;
}

export interface GameSenseRegisterEvents<
	Game extends string = string,
	Event extends string = string
> extends GameSenseBase<Game> {
	event: Event;
	icon_id?: number;
}

export type GameSenseStopEvent<Game extends string = string> =
	GameSenseBase<Game>;

export interface GameSenseEvent<
	Game extends string = string,
	Event extends string = string,
	Frame = void
> extends GameSenseBase<Game> {
	event: Event;
	data: {
		value: number;
		frame?: Frame;
	};
}

export interface CoreProps {
	address: string;
}
