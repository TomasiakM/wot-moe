interface Tank {
  tank_id: number,
  nation: string,
  name: string,
  tier: number,
  type: string,
  image: string,
};

interface TankList  { [key: string]: Tank; };

interface PlayerTank extends Tank {
  max_xp: number;
  max_frags: number;
  mark_of_mastery: number;
  battles: number;
  damage_dealt: number;
  frags: number;
  wins: number;
  xp: number;
  marksOnGun: number;
}

interface Nation {
  name: string;
  value: string;
}

export {
    Tank,
    TankList,
    PlayerTank,
    Nation,
}