export type IClanCarousel = {
	count: number;
	countByTier: {
		[key: string]: number;
	};
	countByNation: {
		[key: string]: number;
	};
	tanks: {
		tank_id: number;
		amount: number;
	}[];
};
