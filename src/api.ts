import {
	GameSenseDescription,
	GameSenseEvent,
	GameSenseRegisterEvents,
} from './types';

interface Events {
	game_metadata: GameSenseDescription;
	register_game_event: GameSenseRegisterEvents;
	game_event: GameSenseEvent;
}

export class SteelSeriesApi {
	constructor(public apiUrl: string) {}

	async send<Method extends keyof Events>(
		method: Method,
		body: Events[Method]
	): Promise<void> {
		await fetch(`http://${this.apiUrl}/${method}`, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
			},
		});
	}
}
