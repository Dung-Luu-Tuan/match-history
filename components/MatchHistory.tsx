'use client';

import { TFTMatch } from '@/types/tft';
import MatchCard from './MatchCard';

interface MatchHistoryProps {
  summonerData: {
    name: string;
    summonerLevel: number;
    profileIconId: number;
    puuid: string;
    matches: TFTMatch[];
  };
}

export default function MatchHistory({ summonerData }: MatchHistoryProps) {
  const { name, summonerLevel, matches } = summonerData;

  return (
    <div className="mt-12">
      <div className="mb-8 text-center">
        <h2 className="text-3xl mb-2">{name}</h2>
        <p className="opacity-80">Level {summonerLevel}</p>
        <p className="opacity-80 mt-2">
          Total Matches: {matches.length}
        </p>
      </div>

      <div className="flex flex-col gap-4">
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
