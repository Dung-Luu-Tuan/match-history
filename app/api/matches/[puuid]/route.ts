import { NextRequest, NextResponse } from 'next/server';
import { getTFTMatchList, getTFTMatches } from '@/lib/riot-api';

export async function GET(
  request: NextRequest,
  { params }: { params: { puuid: string } }
) {
  try {
    const puuid = params.puuid;
    const start = parseInt(request.nextUrl.searchParams.get('start') || '0', 10);
    const count = parseInt(request.nextUrl.searchParams.get('count') || '20', 10);

    if (!puuid) {
      return NextResponse.json(
        { error: 'PUUID is required' },
        { status: 400 }
      );
    }

    // Step 3: Get match list
    const matchIds = await getTFTMatchList(puuid, start, count);

    // Step 4: Get match details
    const matches = await getTFTMatches(matchIds);

    return NextResponse.json({
      puuid,
      matchIds,
      matches,
    });
  } catch (error: any) {
    console.error('Error fetching matches:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch matches' },
      { status: 500 }
    );
  }
}

