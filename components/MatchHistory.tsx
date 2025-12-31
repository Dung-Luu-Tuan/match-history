'use client';

import { TFTMatch, TFTLeagueEntry } from '@/types/tft';
import MatchCard from './MatchCard';
import PlayerOverview from './PlayerOverview';
import MatchSummary from './MatchSummary';

interface MatchHistoryProps {
  summonerData: {
    name: string;
    summonerLevel: number;
    profileIconId: number;
    puuid: string;
    matches: TFTMatch[];
    leagueEntry?: TFTLeagueEntry | null;
  };
}

export default function MatchHistory({ summonerData }: MatchHistoryProps) {
  const { name, summonerLevel, matches, leagueEntry } = summonerData;

  return (
    <div className="mt-12">
      {/* Row 1: Banner (left) + Summary (right) */}
      <div className="flex gap-6 items-start mb-6">
        {/* Left: Banner với rank và avatar */}
        <PlayerOverview
          name={name}
          summonerLevel={summonerLevel}
          profileIconId={summonerData.profileIconId}
          leagueEntry={leagueEntry || null}
          totalMatches={matches.length}
          matches={matches}
          puuid={summonerData.puuid}
        />

        {/* Right: Summary Recent 20 Matches */}
        <MatchSummary
          matches={matches}
          puuid={summonerData.puuid}
          totalMatches={matches.length}
        />
      </div>

      {/* Row 2: Lịch sử đấu */}
      <div className="flex flex-col gap-1">
        {matches.map((match) => (
          <MatchCard 
            key={match.metadata.match_id} 
            match={match} 
            summonerName={name}
            puuid={summonerData.puuid}
          />
        ))}
      </div>
    </div>
  );
}
