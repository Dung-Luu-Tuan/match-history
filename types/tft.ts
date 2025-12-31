// TFT Match History Types
export interface TFTMatch {
  metadata: {
    match_id: string;
    data_version: string;
    participants: string[];
  };
  info: {
    game_datetime: number;
    game_length: number;
    game_version: string;
    participants: TFTParticipant[];
    queue_id: number;
    tft_set_number: number;
  };
}

export interface TFTParticipant {
  companion: {
    content_ID: string;
    item_ID: number;
    skin_ID: number;
    species: string;
  };
  gold_left: number;
  last_round: number;
  level: number;
  placement: number;
  players_eliminated: number;
  puuid: string;
  time_eliminated: number;
  total_damage_to_players: number;
  traits: TFTTrait[];
  units: TFTUnit[];
}

export interface TFTTrait {
  name: string;
  num_units: number;
  style: number;
  tier_current: number;
  tier_total: number;
}

export interface TFTUnit {
  character_id: string;
  items?: number[];
  itemNames?: string[];
  name: string;
  rarity: number;
  tier: number;
}

export interface TFTMatchList {
  puuid: string;
  matchIds: string[];
}

export interface RiotAccount {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export interface TFTSummoner {
  id: string;
  accountId: string;
  puuid: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

export interface SummonerInfo {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

// TFT League Entry (ranked information)
export interface TFTLeagueEntry {
  puuid: string;
  leagueId: string;
  queueType: string; // e.g., "RANKED_TFT", "RANKED_TFT_TURBO"
  tier: string; // e.g., "IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND", "MASTER", "GRANDMASTER", "CHALLENGER"
  rank: string; // e.g., "I", "II", "III", "IV" (only for tiers below MASTER)
  leaguePoints: number; // Current LP
  wins: number;
  losses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
}

