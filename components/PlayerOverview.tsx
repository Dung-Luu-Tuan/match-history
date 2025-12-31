'use client';

import Image from 'next/image';
import { TFTLeagueEntry, TFTMatch } from '@/types/tft';

interface PlayerOverviewProps {
  name: string;
  summonerLevel: number;
  profileIconId: number;
  leagueEntry: TFTLeagueEntry | null;
  totalMatches: number;
  matches: TFTMatch[];
  puuid: string;
}

// Get banner background URL from ap.tft.tools
// Banner tự động thay đổi theo tier (rank)
function getBannerUrl(tier: string): string {
  const tierLower = tier.toLowerCase();
  // ap.tft.tools có banner cho các tier: iron, bronze, silver, gold, platinum, diamond, master, grandmaster, challenger
  return `https://ap.tft.tools/img/banner/bg2_${tierLower}.png?w=200`;
}

// Get wings banner URL để bọc profile avatar
function getWingsBannerUrl(tier: string): string {
  const tierLower = tier.toLowerCase();
  return `https://ap.tft.tools/img/banner/wings2_${tierLower}.png?w=200`;
}

// Get profile icon URL
function getProfileIconUrl(profileIconId: number): string {
  return `https://ap.tft.tools/img/profile-icons/${profileIconId}.jpg?w=156`;
}

// Get companion icon URL
function getCompanionIconUrl(contentId: string): string {
  return `https://ap.tft.tools/img/ll-icons/${contentId}.png?w=104`;
}

// Get rank image URL
function getRankImageUrl(tier: string, rank?: string): string {
  const tierLower = tier.toLowerCase();
  
  // For MASTER, GRANDMASTER, CHALLENGER - no rank
  if (tierLower === 'master' || tierLower === 'grandmaster' || tierLower === 'challenger') {
    return `https://ddragon.leagueoflegends.com/cdn/img/tft/ranked-emblems/${tierLower}.png`;
  }
  
  // For other tiers with rank (I, II, III, IV)
  if (rank) {
    const rankLower = rank.toLowerCase();
    return `https://ddragon.leagueoflegends.com/cdn/img/tft/ranked-emblems/${tierLower}_${rankLower}.png`;
  }
  
  // Fallback
  return `https://ddragon.leagueoflegends.com/cdn/img/tft/ranked-emblems/${tierLower}.png`;
}

// Get tier color
function getTierColor(tier: string): string {
  const tierColors: Record<string, string> = {
    'IRON': '#8B7355',
    'BRONZE': '#CD7F32',
    'SILVER': '#C0C0C0',
    'GOLD': '#FFD700',
    'PLATINUM': '#00D4AA',
    'DIAMOND': '#00B5FF',
    'MASTER': '#9D4EDD',
    'GRANDMASTER': '#FF006E',
    'CHALLENGER': '#FFD700',
  };
  return tierColors[tier] || '#FFFFFF';
}

export default function PlayerOverview({ 
  name, 
  summonerLevel,
  profileIconId,
  leagueEntry,
  totalMatches,
  matches,
  puuid
}: PlayerOverviewProps) {
  const rankedEntry = leagueEntry?.queueType === 'RANKED_TFT' ? leagueEntry : null;
  
  // Get companion from most recent match
  const mostRecentMatch = matches.length > 0 ? matches[0] : null;
  const participant = mostRecentMatch?.info.participants.find(p => p.puuid === puuid);
  const companion = participant?.companion;
  const companionIconUrl = companion?.content_ID 
    ? getCompanionIconUrl(companion.content_ID)
    : null;

  // Get banner URL based on tier, fallback to iron if no rank
  const bannerUrl = rankedEntry 
    ? getBannerUrl(rankedEntry.tier) 
    : 'https://ap.tft.tools/img/banner/bg2_iron.png?w=200';
  const wingsBannerUrl = rankedEntry
    ? getWingsBannerUrl(rankedEntry.tier)
    : 'https://ap.tft.tools/img/banner/wings2_iron.png?w=200';
  const profileIconUrl = getProfileIconUrl(profileIconId);

  const bannerHeight = 380;

  return (
    <div className="shrink-0">
      {/* Banner Wrapper - Bọc rank và avatar, tự động thay đổi theo tier */}
      <div 
        className="relative rounded-[15px] overflow-hidden" 
        style={{ width: '200px', height: `${bannerHeight}px` }}
      >
        {/* Banner Background - object-fit: fill */}
        <Image
          src={bannerUrl}
          alt={`${rankedEntry?.tier || 'IRON'} rank banner`}
          width={200}
          height={bannerHeight}
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 0, objectFit: 'fill' }}
          unoptimized
          priority
        />
        
        {/* Wings Banner - Bọc profile avatar */}
        <Image
          src={wingsBannerUrl}
          alt={`${rankedEntry?.tier || 'IRON'} wings banner`}
          width={200}
          height={bannerHeight}
          className="absolute left-0 w-full h-full"
          style={{ 
            zIndex: 5, 
            objectFit: 'contain',
            top: '-100px',
            transform: 'translateY(0)'
          }}
          unoptimized
        />
        
        {/* Content Overlay - Rank và Avatar */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white" style={{ zIndex: 10 }}>
          {/* Profile Icons */}
          <div className="flex items-center gap-2 mb-3">
            {/* Profile Icon (Account) */}
            <div className="relative -top-5 w-[72px] h-[72px] rounded-full border-2 border-white/30 overflow-hidden bg-white/10" style={{ zIndex: 15 }}>
              <Image
                src={profileIconUrl}
                alt="Profile icon"
                width={64}
                height={64}
                className="w-full h-full object-cover"
                unoptimized
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7wn5GAPC90ZXh0Pjwvc3ZnPg==';
                }}
              />
            </div>
          </div>
          
          {/* Player Name */}
          <h2 className="text-xl font-bold mb-1 text-center">{name}</h2>
          
          {/* Rank and LP */}
          {rankedEntry && (
            <div className="text-sm font-semibold mb-1 text-center">
              {rankedEntry.tier} {rankedEntry.rank || ''} {rankedEntry.leaguePoints}LP
            </div>
          )}
          
          {/* Level */}
          <div className="text-xs opacity-90">Level {summonerLevel}</div>
        </div>
      </div>
    </div>
  );
}

