'use client';

import { TFTMatch } from '@/types/tft';

interface MatchSummaryProps {
  matches: TFTMatch[];
  puuid: string;
  totalMatches: number;
}

export default function MatchSummary({ matches, puuid, totalMatches }: MatchSummaryProps) {
  // Calculate stats from matches
  const placements = matches
    .map(match => {
      const participant = match.info.participants.find(p => p.puuid === puuid);
      return participant?.placement;
    })
    .filter((p): p is number => p !== undefined);
  
  const avgPlacement = placements.length > 0
    ? (placements.reduce((sum, p) => sum + p, 0) / placements.length).toFixed(2)
    : '0';
  
  const top4Count = placements.filter(p => p <= 4).length;
  const top4Percent = placements.length > 0
    ? ((top4Count / placements.length) * 100).toFixed(1)
    : '0';
  
  const wonCount = placements.filter(p => p === 1).length;
  const wonPercent = placements.length > 0
    ? ((wonCount / placements.length) * 100).toFixed(1)
    : '0';

  return (
    <div className="flex-1 bg-[rgba(30,30,40,0.9)] backdrop-blur-[10px] rounded-[15px] p-6 border-2 border-white/10">
      <h3 className="text-2xl font-bold mb-4 text-center">Recent {totalMatches} Matches</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Games */}
        <div className="bg-[rgba(0,0,0,0.3)] rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-white mb-1">{totalMatches}</div>
          <div className="text-sm opacity-70">Games</div>
        </div>
        
        {/* Avg Placement */}
        <div className="bg-[rgba(0,0,0,0.3)] rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-white mb-1">{avgPlacement}</div>
          <div className="text-sm opacity-70">Avg</div>
        </div>
        
        {/* Top 4 Count */}
        <div className="bg-[rgba(0,0,0,0.3)] rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-400 mb-1">{top4Count}</div>
          <div className="text-sm opacity-70">Top 4</div>
        </div>
        
        {/* Top 4 % */}
        <div className="bg-[rgba(0,0,0,0.3)] rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-400 mb-1">{top4Percent}%</div>
          <div className="text-sm opacity-70">Top 4%</div>
        </div>
        
        {/* Won Count */}
        <div className="bg-[rgba(0,0,0,0.3)] rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-1">{wonCount}</div>
          <div className="text-sm opacity-70">Won</div>
        </div>
        
        {/* Won % */}
        <div className="bg-[rgba(0,0,0,0.3)] rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-1">{wonPercent}%</div>
          <div className="text-sm opacity-70">Won %</div>
        </div>
      </div>
    </div>
  );
}

