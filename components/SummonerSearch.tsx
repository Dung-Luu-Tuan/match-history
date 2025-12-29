'use client';

import { useState } from 'react';

interface SummonerSearchProps {
  onSearch: (summonerName: string) => void;
  loading: boolean;
}

export default function SummonerSearch({ onSearch, loading }: SummonerSearchProps) {
  const [summonerName, setSummonerName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (summonerName.trim()) {
      onSearch(summonerName.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-[600px] mx-auto">
      <div className="flex gap-4">
        <input
          type="text"
          value={summonerName}
          onChange={(e) => setSummonerName(e.target.value)}
          placeholder="Enter Riot ID (e.g., Lians#1211)..."
          disabled={loading}
          className="flex-1 px-6 py-4 text-base rounded-lg border-none bg-white/10 text-white backdrop-blur-[10px] placeholder:text-white/70"
        />
        <button
          type="submit"
          disabled={loading || !summonerName.trim()}
          className={`px-8 py-4 text-base font-bold rounded-lg border-none text-white cursor-pointer transition-all duration-200 backdrop-blur-[10px] ${
            loading || !summonerName.trim()
              ? 'bg-white/30 cursor-not-allowed'
              : 'bg-white/20 hover:bg-white/30'
          }`}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  );
}
