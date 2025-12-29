import { NextRequest, NextResponse } from 'next/server';
import { getAccountByRiotId, getTFTSummonerByPuuid, getTFTMatchList, getTFTMatches } from '@/lib/riot-api';

// Combined endpoint: Get full player data (account + summoner + matches)
// Format: /api/player/Lians#1211?platform=vn2
export async function GET(
  request: NextRequest,
  { params }: { params: { riotId: string } }
) {
  try {
    const riotId = params.riotId;
    const platform = request.nextUrl.searchParams.get('platform') || 'vn2';
    const start = parseInt(request.nextUrl.searchParams.get('start') || '0', 10);
    const count = parseInt(request.nextUrl.searchParams.get('count') || '20', 10);

    if (!riotId) {
      return NextResponse.json(
        { error: 'Riot ID is required (format: gameName#tagLine)' },
        { status: 400 }
      );
    }

    // Parse gameName#tagLine
    const [gameName, tagLine] = riotId.split('#');
    if (!gameName || !tagLine) {
      return NextResponse.json(
        { error: 'Invalid Riot ID format. Use: gameName#tagLine' },
        { status: 400 }
      );
    }

    // Step 1: Get account by Riot ID
    const account = await getAccountByRiotId(gameName, tagLine);

    // Step 2: Get TFT summoner by PUUID
    const summoner = await getTFTSummonerByPuuid(account.puuid, platform);

    // Step 3: Get match list
    const matchIds = await getTFTMatchList(account.puuid, start, count);

    // Step 4: Get match details with delay to avoid rate limits
    // Add delay between match requests (100ms default)
    const matches = await getTFTMatches(matchIds, 150);

    return NextResponse.json({
      account,
      summoner,
      matches,
      matchIds,
    });
  } catch (error: any) {
    console.error('Error fetching player data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch player data' },
      { status: 500 }
    );
  }
}

