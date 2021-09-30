export interface PlayerInfo {
  account_id: number,
  nickname: string,
  battles: number,
  wins: number,
  frags: number,
  global_rating: number,
  max_damage: number,
  max_damage_tank_id: number,
  max_frags: number,
  max_frags_tank_id: number,
  max_xp: number,
  max_xp_tank_id: number,
  created_at: number,
  last_battle_time: number,
  clan_id: number | null
}
