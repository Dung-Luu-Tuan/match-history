'use client';

import { useState } from 'react';
import Image from 'next/image';
import { TFTMatch, TFTParticipant, TFTUnit } from '@/types/tft';
import { 
  getChampionImageUrlSync, 
  getItemImageUrlSync, 
  getTraitImageUrlSync,
  getCompanionImageUrlSync,
  getFallbackChampionImageUrl,
  getFallbackTraitImageUrl,
  getFallbackItemImageUrl
} from '@/lib/ddragon';
import MatchDetail from './MatchDetail';

interface MatchCardProps {
  match: TFTMatch;
  summonerName: string;
  puuid: string;
}

export default function MatchCard({ match, summonerName, puuid }: MatchCardProps) {
  const [showDetail, setShowDetail] = useState(false);
  const { info } = match;
  
  // Find participant by PUUID
  const participant = info.participants.find(
    (p) => p.puuid === puuid
    ) as TFTParticipant;

  if (!participant) {
    return null;
  }

  const getPlacementColor = (placement: number) => {
    if (placement === 1) return '#FFD700'; // Gold
    if (placement <= 4) return '#4CAF50'; // Green
    if (placement <= 6) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  // Calculate health percentage (approximate based on placement)
  const getHealthPercentage = (placement: number) => {
    // Top 4 = high health, bottom 4 = low health
    if (placement <= 2) return '98%';
    if (placement <= 4) return '75%';
    if (placement <= 6) return '50%';
    return '25%';
  };

  // Get active traits with images
  const activeTraits = participant.traits.filter((trait) => trait.tier_current > 0);

  // Get rarity border color
  const getRarityColor = (rarity: number) => {
    if (rarity >= 5) return '#FFD700'; // Gold - 5 cost
    if (rarity >= 4) return '#9C27B0'; // Purple - 4 cost
    if (rarity >= 3) return '#2196F3'; // Blue - 3 cost
    if (rarity >= 2) return '#4CAF50'; // Green - 2 cost
    return '#9E9E9E'; // Gray - 1 cost
  };

  return (
    <>
      <div
        className="bg-[rgba(30,30,40,0.9)] backdrop-blur-[10px] rounded-[10px] p-5 border-2 w-full flex flex-col gap-3 transition-all duration-200 cursor-pointer hover:bg-[rgba(40,40,50,0.95)] hover:scale-[1.01]"
        style={{ borderColor: getPlacementColor(participant.placement) }}
        onClick={() => setShowDetail(true)}
      >
      {/* Top Section - Stats and Traits */}
      <div className="flex justify-between items-center pb-3 border-b border-white/10">
        {/* Left: Rank, Gold, Health, Round */}
        <div className="flex gap-5 items-center flex-wrap">
          {/* Ranked LP */}
          <div className="flex items-center gap-1.5">
            <span 
              className="text-sm font-bold"
              style={{ color: getPlacementColor(participant.placement) }}
            >
              Ranked
            </span>
          </div>

          {/* Round */}
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold">
              {Math.floor(participant.last_round / 7)}-{participant.last_round % 7 || 7}
            </span>
          </div>
        </div>

        {/* Right: Traits with Champion Count */}
        <div className="flex gap-2.5 flex-wrap items-center">
          {activeTraits.map((trait) => (
            <div
              key={trait.name}
              className="flex items-center gap-1.5 bg-[rgba(255,215,0,0.2)] px-1 py-0.5 rounded-[5px] border border-[rgba(255,215,0,0.4)]"
              title={`${trait.name}: ${trait.num_units} champions`}
            >
              <Image
                src={getTraitImageUrlSync(trait.name, trait.tier_current)}
                alt={trait.name}
                width={10}
                height={10}
                className="object-contain"
                unoptimized
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  // Try different tier if current one fails
                  const currentSrc = img.src;
                  if (currentSrc.includes('_1.svg') && trait.tier_current > 1) {
                    // Try tier 1 as fallback
                    img.src = getFallbackTraitImageUrl(trait.name, 1);
                  } else if (currentSrc.includes('_2.svg') && trait.tier_current > 2) {
                    // Try tier 2 as fallback
                    img.src = getFallbackTraitImageUrl(trait.name, 2);
                  } else {
                    // Final fallback - hide if all fail
                    img.style.display = 'none';
                  }
                }}
              />
              <span className="text-[0.6rem] font-bold text-[#FFD700]">
                {trait.num_units}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section - Level, Avatar, Champions */}
        <div className="flex gap-3 items-start">
          {/* Placement Indicator */}
          <div 
            className="w-10 h-10 rounded-md flex items-center justify-center text-xl font-bold text-white shrink-0"
            style={{ 
              backgroundColor: 
                participant.placement === 1 
                  ? '#FFD700' // Gold for top 1
                  : participant.placement <= 4 
                  ? '#4CAF50' // Green for top 2-4
                  : '#9E9E9E' // Gray for top 5-8
            }}
          >
            {participant.placement}
          </div>

        {/* Player Avatar */}
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/30">
            {participant.companion ? (
              <Image
                src={getCompanionImageUrlSync(participant.companion)}
                alt={participant.companion.species || 'Companion'}
                width={38}
                height={38}
                className="w-full h-full object-cover rounded-full"
                unoptimized
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTUiIGhlaWdodD0iNTUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjU1IiBoZWlnaHQ9IjU1IiBmaWxsPSIjNjY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTMiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QZXQ8L3RleHQ+PC9zdmc+';
                }}
              />
            ) : (
              <span className="text-xl">👤</span>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#2196F3] flex items-center justify-center text-[0.7rem] font-bold text-white border-2 border-[rgba(30,30,40,0.9)]">
            {participant.units.length}
          </div>
        </div>

        {/* Champions Grid */}
        <div className="flex gap-2.5 flex-wrap flex-1">
          {participant.units.map((unit: TFTUnit, index: number) => (
            <div
              key={`${unit.character_id}-${index}`}
              className="flex flex-col items-center gap-1.5"
            >
              {/* Champion Portrait */}
              <div
                className="relative w-[38px] h-[38px] rounded-[5px] border-2 shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
                style={{ borderColor: getRarityColor(unit.rarity) }}
                title={unit.character_id}
              >
                <div className="w-full h-full overflow-hidden rounded-[5px]">
                  <Image
                    src={getChampionImageUrlSync(unit.character_id)}
                    alt={unit.character_id}
                    width={38}
                    height={38}
                    className="w-full h-full object-cover"
                    unoptimized
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement;
                      const currentSrc = img.src;
                      if (!currentSrc.includes('/img/tft-champion/') && !currentSrc.includes('ap.tft.tools')) {
                        const version = '15.24.1';
                        const tftPath = `https://ddragon.leagueoflegends.com/cdn/${version}/img/tft-champion/${unit.character_id}.png`;
                        img.src = tftPath;
                      } else if (!currentSrc.includes('ap.tft.tools')) {
                        img.src = getFallbackChampionImageUrl(unit.character_id, 140);
                      } else {
                        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Vbml0PC90ZXh0Pjwvc3ZnPg==';
                      }
                    }}
                  />
                </div>
                
                {/* Star Rating - Top */}
                {unit.tier > 1 && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-px bg-black/50 px-0.5 py-0 rounded-[2px] z-10">
                    {Array.from({ length: unit.tier }).map((_, i) => (
                      <span 
                        key={i} 
                        className="text-[0.55rem]"
                        style={{ color: unit.tier === 3 ? '#FFD700' : '#C0C0C0' }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                )}

                {/* Items at Bottom */}
                {((unit.items && unit.items.length > 0) || (unit.itemNames && unit.itemNames.length > 0)) && (
                  <div className={`absolute -bottom-2 flex gap-px py-0 rounded-[2px] z-10 ${
                    ((unit.itemNames || unit.items || []).length === 1) ? 'left-1/2 -translate-x-1/2' : ''
                  }`}>
                    {(unit.itemNames || unit.items || []).slice(0, 3).map(
                      (itemId: string | number, itemIndex: number) => (
                        <Image
                          key={itemIndex}
                          src={getItemImageUrlSync(itemId)}
                          alt={`Item ${itemId}`}
                          width={11}
                          height={11}
                          className="rounded-[2px]"
                          unoptimized
                          onError={(e) => {
                            const img = e.currentTarget as HTMLImageElement;
                            const currentSrc = img.src;
                            if (!currentSrc.includes('ap.tft.tools')) {
                              img.src = getFallbackItemImageUrl(itemId, 24);
                            } else {
                              img.style.display = 'none';
                            }
                          }}
                        />
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>

      {/* Match Detail Modal */}
      {showDetail && (
        <MatchDetail
          match={match}
          currentPuuid={puuid}
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  );
}
