'use client';

import { useRouter } from 'next/navigation';
import SummonerSearch from '@/components/SummonerSearch';

export default function Home() {
  const router = useRouter();

  const handleSearch = async (riotId: string) => {
    // Parse gameName#tagLine format
    if (!riotId.includes('#')) {
      return;
    }

    const [gameName, tagLine] = riotId.split('#');
    if (!gameName || !tagLine) {
      return;
    }

    // Default to vn region, user can change later if needed
    // Navigate to the player page
    router.push(`/player/vn/${encodeURIComponent(gameName)}/${tagLine}`);
  };

  return (
    <main className="p-8 max-w-[1400px] mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl mb-4 font-bold">
          TFT Match History
        </h1>
        <p className="text-xl opacity-90">
          View your Teamfight Tactics match history
        </p>
      </div>

      <SummonerSearch onSearch={handleSearch} loading={false} />
    </main>
  );
}
