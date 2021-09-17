import { GameSenseDescription, GameSenseEvent, GameSenseRegisterEvents, GameSenseStopEvent } from './types';
import { getPortFromUrl } from './utils/getPortFromUrl';

interface Events {
	game_metadata: GameSenseDescription;
	register_game_event: GameSenseRegisterEvents;
	stop_game: GameSenseStopEvent;
	game_event: GameSenseEvent;
}

export class SteelSeriesApi {
	private readonly port: number;
	constructor(address: string) {
		this.port = getPortFromUrl(address);
	}

	async send<Method extends keyof Events>(method: Method, body: Events[Method]): Promise<void> {
		await fetch(`http://localhost:${this.port}/${method}`, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
			},
		});
	}
}
