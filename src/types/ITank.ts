interface ITankList {
	[key: string]: ITank;
}

interface ITank {
	image: string;
	name: string;
	nation: string;
	tank_id: number;
	tier: Tier;
	type: string;
}

interface INation {
	name: string;
	value: string;
}

type Tier = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export { ITankList, ITank, INation, Tier };
