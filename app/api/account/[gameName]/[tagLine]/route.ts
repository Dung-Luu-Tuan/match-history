import { NextRequest, NextResponse } from 'next/server';
import { getAccountByRiotId } from '@/lib/riot-api';

export async function GET(
  request: NextRequest,
  { params }: { params: { gameName: string; tagLine: string } }
) {
  try {
    const { gameName, tagLine } = params;

    if (!gameName || !tagLine) {
      return NextResponse.json(
        { error: 'Game name and tag line are required' },
        { status: 400 }
      );
    }

    const account = await getAccountByRiotId(gameName, tagLine);
    return NextResponse.json(account);
  } catch (error: any) {
    console.error('Error fetching account:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch account' },
      { status: 500 }
    );
  }
}

