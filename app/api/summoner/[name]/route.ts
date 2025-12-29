import { NextRequest, NextResponse } from 'next/server';
import { getTFTSummonerByPuuid } from '@/lib/riot-api';

export async function GET(
  request: NextRequest,
  { params }: { params: { puuid: string } }
) {
  try {
    const puuid = params.puuid;
    const platform = request.nextUrl.searchParams.get('platform') || 'vn2';

    if (!puuid) {
      return NextResponse.json(
        { error: 'PUUID is required' },
        { status: 400 }
      );
    }

    const summoner = await getTFTSummonerByPuuid(puuid, platform);
    return NextResponse.json(summoner);
  } catch (error: any) {
    console.error('Error fetching summoner:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch summoner' },
      { status: 500 }
    );
  }
}

