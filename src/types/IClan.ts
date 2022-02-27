interface IClan {
	name: string;
	tag: string;
	description_html: string;
	color: "#FFFF00";
	clan_id: number;
	logo: string;
	members: IClanMember[];
	marks: IClanMarks;
}

interface IClanMember {
	account_id: number;
	account_name: string;
	moe: {
		3: number;
		2: number;
		1: number;
	};
}

interface IClanMarks {
	3: ITank[];
	2: ITank[];
	1: ITank[];
}

interface ITank {
	tank_id: number;
	amount: number;
}

export { IClan, IClanMember, IClanMarks };
