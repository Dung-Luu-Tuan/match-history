'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MatchHistory from '@/components/MatchHistory';
import SummonerSearch from '@/components/SummonerSearch';
import { getPlatformFromRegion } from '@/lib/region-utils';

export default function PlayerPage() {
  const params = useParams();
  const router = useRouter();
  const region = params.region as string;
  const gameName = decodeURIComponent(params.gameName as string);
  const tagLine = params.tagLine as string;

  const [summonerData, setSummonerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayerData = async () => {
      if (!gameName || !tagLine) return;

      setLoading(true);
      setError(null);
      setSummonerData(null);

      try {
        const platform = getPlatformFromRegion(region);
        const riotId = `${gameName}#${tagLine}`;
        
        // Use combined endpoint that follows the correct API flow
        const response = await fetch(`/api/player/${encodeURIComponent(riotId)}?platform=${platform}&count=10`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Player not found');
        }

        const data = await response.json();
        setSummonerData({
          ...data.account,
          ...data.summoner,
          name: data.account.gameName,
          tagLine: data.account.tagLine,
          puuid: data.account.puuid,
          matches: data.matches,
        });
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [region, gameName, tagLine]);

  const handleSearch = async (riotId: string) => {
    if (!riotId.includes('#')) {
      setError('Please enter correct format: gameName#tagLine (e.g., Lians#1211)');
      return;
    }

    const [newGameName, newTagLine] = riotId.split('#');
    if (!newGameName || !newTagLine) {
      setError('Invalid Riot ID format. Use: gameName#tagLine');
      return;
    }

    // Navigate to the new player page
    router.push(`/player/${region}/${encodeURIComponent(newGameName)}/${newTagLine}`);
  };

  return (
    <>
      {/* Full Page Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
            <div className="text-white text-xl font-semibold">Loading match history...</div>
          </div>
        </div>
      )}

      <main className="p-8 max-w-[1400px] mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl mb-4 font-bold">
            TFT Match History
          </h1>
          <p className="text-xl opacity-90">
            View your Teamfight Tactics match history
          </p>
        </div>

        <SummonerSearch onSearch={handleSearch} loading={loading} />

        {error && (
          <div className="mt-8 p-6 bg-red-500/20 border border-red-500/50 rounded-lg text-center">
            <div className="text-lg font-bold mb-2">
              {error.includes('rate limit') ? '⚠️ Rate Limit Exceeded' : '❌ Error'}
            </div>
            <div>{error}</div>
            {error.includes('rate limit') && (
              <div className="mt-4 text-sm opacity-90">
                Please wait a moment before trying again. Riot API has rate limits to prevent abuse.
              </div>
            )}
          </div>
        )}

        {summonerData && <MatchHistory summonerData={summonerData} />}
      </main>
    </>
  );
}

