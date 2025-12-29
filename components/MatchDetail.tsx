'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { TFTMatch, TFTParticipant, TFTUnit } from '@/types/tft';
import {
  getChampionImageUrlSync,
  getItemImageUrlSync,
  getTraitImageUrlSync,
  getCompanionImageUrlSync,
  getFallbackChampionImageUrl,
  getFallbackTraitImageUrl,
  getFallbackItemImageUrl,
} from '@/lib/ddragon';

interface MatchDetailProps {
  match: TFTMatch;
  currentPuuid: string;
  onClose: () => void;
}

export default function MatchDetail({
  match,
  currentPuuid,
  onClose,
}: MatchDetailProps) {
  const { info } = match;

  // Prevent body scroll when modal is open
  useEffect(() => {
    // Save current scroll position
    const scrollY = window.scrollY;
    
    // Lock scroll on both html and body
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.position = 'fixed';
    document.documentElement.style.width = '100%';
    document.documentElement.style.top = `-${scrollY}px`;
    
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${scrollY}px`;
    
    return () => {
      // Restore scroll
      document.documentElement.style.overflow = '';
      document.documentElement.style.position = '';
      document.documentElement.style.width = '';
      document.documentElement.style.top = '';
      
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      
      // Restore scroll position
      window.scrollTo(0, scrollY);
    };
  }, []);

  // Sort participants by placement
  const sortedParticipants = [...info.participants].sort(
    (a, b) => a.placement - b.placement
  );

  const getPlacementColor = (placement: number) => {
    if (placement === 1) return '#FFD700'; // Gold
    if (placement <= 4) return '#4CAF50'; // Green
    if (placement <= 6) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  const getRarityColor = (rarity: number) => {
    if (rarity >= 5) return '#FFD700'; // Gold
    if (rarity >= 4) return '#9C27B0'; // Purple
    if (rarity >= 3) return '#2196F3'; // Blue
    if (rarity >= 2) return '#4CAF50'; // Green
    return '#9E9E9E'; // Gray
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 overflow-hidden"
      onClick={onClose}
    >
      <div
        className="bg-[rgba(30,30,40,0.95)] rounded-xl p-4 max-w-[1200px] w-full max-h-[95vh] overflow-y-auto overflow-x-hidden custom-scrollbar border-2 border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          {/* Match Info */}
          <div className="mb-3 p-2 bg-white/5 rounded">
            <div className="flex gap-4 flex-wrap">
              <div>
                <span className="opacity-70 text-xs">Date: </span>
                <span className="text-xs">
                  {formatDate(info.game_datetime)}
                </span>
              </div>
              <div>
                <span className="opacity-70 text-xs">Duration: </span>
                <span className="text-xs">
                  {formatDuration(info.game_length)}
                </span>
              </div>
              <div>
                <span className="opacity-70 text-xs">Set: </span>
                <span className="text-xs">TFT Set {info.tft_set_number}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-lg text-white cursor-pointer p-1.5 rounded hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* All Participants */}
        <div className="grid gap-2">
          {sortedParticipants.map((participant: TFTParticipant) => {
            const isCurrentPlayer = participant.puuid === currentPuuid;
            const activeTraits = participant.traits.filter(
              (trait) => trait.tier_current > 0
            );

            return (
              <div
                key={participant.puuid}
                className={`flex justify-center items-center rounded-lg p-2 border-2 flex gap-3 ${
                  isCurrentPlayer ? 'bg-[rgba(33,150,243,0.2)]' : 'bg-white/5'
                }`}
                style={{
                  borderColor: isCurrentPlayer
                    ? '#2196F3'
                    : getPlacementColor(participant.placement),
                }}
              >
                {/* Placement - Left side, centered */}
                <div
                  className="w-10 h-10 rounded flex items-center justify-center text-base font-bold text-white shrink-0"
                  style={{
                    backgroundColor: getPlacementColor(participant.placement),
                  }}
                >
                  {participant.placement}
                </div>

                {participant.companion && (
                  <div className="relative shrink-0">
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/30">
                      <Image
                        src={getCompanionImageUrlSync(participant.companion)}
                        alt={participant.companion.species || 'Companion'}
                        width={30}
                        height={30}
                        className="w-full h-full object-cover"
                        unoptimized
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjM1IiBoZWlnaHQ9IjM1IiBmaWxsPSIjNjY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QZXQ8L3RleHQ+PC9zdmc+';
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Right side content */}
                <div className="flex-1 flex flex-row">
                  <div className="flex-1 flex flex-col">
                    {/* Traits */}
                    <div className="flex gap-1.5 flex-wrap mb-3">
                      {activeTraits.map((trait) => (
                        <div
                          key={trait.name}
                          className="flex items-center gap-1 bg-[rgba(255,215,0,0.2)] px-1 py-0 rounded border border-[rgba(255,215,0,0.4)]"
                          title={trait.name}
                        >
                          <Image
                            src={getTraitImageUrlSync(
                              trait.name,
                              trait.tier_current
                            )}
                            alt={trait.name}
                            width={12}
                            height={6}
                            className="object-contain"
                            unoptimized
                            onError={(e) => {
                              const img = e.currentTarget as HTMLImageElement;
                              const currentSrc = img.src;
                              if (
                                currentSrc.includes('_1.svg') &&
                                trait.tier_current > 1
                              ) {
                                img.src = getFallbackTraitImageUrl(
                                  trait.name,
                                  1
                                );
                              } else if (
                                currentSrc.includes('_2.svg') &&
                                trait.tier_current > 2
                              ) {
                                img.src = getFallbackTraitImageUrl(
                                  trait.name,
                                  2
                                );
                              } else {
                                img.style.display = 'none';
                              }
                            }}
                          />
                          <span className="text-sm font-medium text-[#FFD700]">
                            {trait.num_units}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Champions Grid */}
                    <div className="flex gap-1.5 flex-wrap">
                      {participant.units.map((unit: TFTUnit, index: number) => (
                        <div
                          key={`${unit.character_id}-${index}`}
                          className="flex flex-col items-center gap-1"
                        >
                          {/* Champion Portrait */}
                          <div
                            className="relative w-[38px] h-[38px] rounded border-2 shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                            style={{ borderColor: getRarityColor(unit.rarity) }}
                            title={unit.character_id}
                          >
                            <div className="w-full h-full overflow-hidden rounded">
                              <Image
                                src={getChampionImageUrlSync(unit.character_id)}
                                alt={unit.character_id}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                                unoptimized
                                onError={(e) => {
                                  const img =
                                    e.currentTarget as HTMLImageElement;
                                  const currentSrc = img.src;
                                  if (
                                    !currentSrc.includes(
                                      '/img/tft-champion/'
                                    ) &&
                                    !currentSrc.includes('ap.tft.tools')
                                  ) {
                                    const version = '15.24.1';
                                    const tftPath = `https://ddragon.leagueoflegends.com/cdn/${version}/img/tft-champion/${unit.character_id}.png`;
                                    img.src = tftPath;
                                  } else if (
                                    !currentSrc.includes('ap.tft.tools')
                                  ) {
                                    img.src = getFallbackChampionImageUrl(
                                      unit.character_id,
                                      140
                                    );
                                  } else {
                                    img.src =
                                      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTciIGhlaWdodD0iNTciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjU3IiBoZWlnaHQ9IjU3IiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Vbml0PC90ZXh0Pjwvc3ZnPg==';
                                  }
                                }}
                              />
                            </div>

                            {/* Star Rating */}
                            {unit.tier > 1 && (
                              <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-px bg-black/50 px-0.5 py-0 rounded-[2px] z-10">
                                {Array.from({ length: unit.tier }).map(
                                  (_, i) => (
                                    <span
                                      key={i}
                                      className="text-[0.5rem]"
                                      style={{
                                        color:
                                          unit.tier === 3
                                            ? '#FFD700'
                                            : '#C0C0C0',
                                      }}
                                    >
                                      ★
                                    </span>
                                  )
                                )}
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

                  {/* Header with Companion, Stats, and You badge */}
                  <div className="flex justify-between items-center mb-2 gap-2">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 flex-1">
                      <div className="flex flex-col">
                        <span className="opacity-70 text-xs">Level</span>
                        <span className="font-bold text-xs">
                          {participant.level}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="opacity-70 text-xs">Gold Left</span>
                        <span className="font-bold text-xs">
                          {participant.gold_left}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="opacity-70 text-xs">
                          Damage to Players
                        </span>
                        <span className="font-bold text-xs">
                          {participant.total_damage_to_players.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
