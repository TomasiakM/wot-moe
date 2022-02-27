interface IPlayer {
	account_id: number;
	nickname: string;

	global_rating: number;
	battles: number;
	wins: number;
	created_at: number;
	last_battle_time: number;

	max_xp: number;
	max_xp_tank_id: number;
	max_frags: number;
	max_frags_tank_id: number;
	max_damage: number;
	max_damage_tank_id: number;

	clan: {
		clan_id: number;
		name: string;
		tag: string;
		color: string;
		logo: string;
	} | null;

	tanks: IPlayerTank[];
}

interface IPlayerTank {
	mark_of_mastery: number;
	tank_id: number;
	max_xp: number;
	max_frags: number;
	xp: number;
	damage_dealt: number;
	frags: number;
	battles: number;
	wins: number;
	marksOnGun: 0 | 1 | 2 | 3;
}

export { IPlayer, IPlayerTank };
