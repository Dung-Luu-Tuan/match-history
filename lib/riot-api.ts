// Riot API Client
const RIOT_API_KEY = process.env.RIOT_API_KEY;
// Account API uses asia.api.riotgames.com (regional routing)
const RIOT_API_BASE_URL_ACCOUNT = process.env.RIOT_API_BASE_URL_ACCOUNT || 'https://asia.api.riotgames.com';
// Match API uses sea.api.riotgames.com (regional routing)
const RIOT_API_BASE_URL_TFT = process.env.RIOT_API_BASE_URL_TFT || 'https://sea.api.riotgames.com/tft';

if (!RIOT_API_KEY) {
  console.warn('RIOT_API_KEY is not set. Please add it to .env.local');
}

interface RiotAPIError {
  status: {
    status_code: number;
    message: string;
  };
}

// Sleep helper for delays
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Retry with exponential backoff
async function fetchRiotAPIWithRetry<T>(
  url: string,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      if (!RIOT_API_KEY) {
        throw new Error('RIOT_API_KEY is not configured');
      }

      // Add API key as query parameter
      const separator = url.includes('?') ? '&' : '?';
      const urlWithKey = `${url}${separator}api_key=${RIOT_API_KEY}`;

      const response = await fetch(urlWithKey);

      // Check for rate limit (429)
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : baseDelay * Math.pow(2, attempt);
        
        if (attempt < maxRetries - 1) {
          console.warn(`Rate limit hit. Waiting ${waitTime}ms before retry ${attempt + 1}/${maxRetries}`);
          await sleep(waitTime);
          continue;
        } else {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        }
      }

      if (!response.ok) {
        const error: RiotAPIError = await response.json().catch(() => ({
          status: {
            status_code: response.status,
            message: response.statusText,
          },
        }));
        
        // Handle different error types
        if (response.status === 404) {
          throw new Error('Player not found. Please check the Riot ID format.');
        } else if (response.status === 403) {
          throw new Error('API key is invalid or expired. Please check your API key.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        }
        
        throw new Error(`Riot API Error: ${error.status?.message || response.statusText}`);
      }

      return response.json();
    } catch (error: any) {
      lastError = error;
      
      // If it's a rate limit error and we have retries left, continue
      if (error.message?.includes('rate limit') && attempt < maxRetries - 1) {
        const waitTime = baseDelay * Math.pow(2, attempt);
        console.warn(`Rate limit error. Waiting ${waitTime}ms before retry ${attempt + 1}/${maxRetries}`);
        await sleep(waitTime);
        continue;
      }
      
      // If it's not a retryable error, throw immediately
      if (!error.message?.includes('rate limit') && !error.message?.includes('429')) {
        throw error;
      }
    }
  }

  throw lastError || new Error('Failed to fetch data after retries');
}

async function fetchRiotAPI<T>(url: string): Promise<T> {
  return fetchRiotAPIWithRetry<T>(url);
}

// Step 1: Get account by Riot ID (gameName#tagLine)
// Returns: { puuid, gameName, tagLine }
export async function getAccountByRiotId(gameName: string, tagLine: string) {
  const url = `${RIOT_API_BASE_URL_ACCOUNT}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;
  return fetchRiotAPI<{ puuid: string; gameName: string; tagLine: string }>(url);
}

// Step 2: Get TFT summoner by PUUID (platform-specific)
// platform: vn2, th2, sg2, ph2, tw2, etc.
export async function getTFTSummonerByPuuid(puuid: string, platform: string = 'vn2') {
  const url = `https://${platform}.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/${puuid}`;
  return fetchRiotAPI(url);
}

// Step 3: Get TFT match list by PUUID
export async function getTFTMatchList(puuid: string, start: number = 0, count: number = 20): Promise<string[]> {
  const url = `${RIOT_API_BASE_URL_TFT}/match/v1/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}`;
  return fetchRiotAPI<string[]>(url);
}

// Step 4: Get TFT match details
export async function getTFTMatch(matchId: string) {
  const url = `${RIOT_API_BASE_URL_TFT}/match/v1/matches/${matchId}`;
  return fetchRiotAPI(url);
}

// Get multiple TFT matches with delay to avoid rate limiting
export async function getTFTMatches(matchIds: string[], delayMs: number = 100) {
  const matches = [];
  
  // Fetch sequentially with delay to avoid rate limits
  for (let i = 0; i < matchIds.length; i++) {
    try {
      const match = await getTFTMatch(matchIds[i]);
      matches.push(match);
      
      // Add delay between requests (except for the last one)
      if (i < matchIds.length - 1) {
        await sleep(delayMs);
      }
    } catch (error: any) {
      console.error(`Error fetching match ${matchIds[i]}:`, error);
      // Continue with other matches even if one fails
      if (error.message?.includes('rate limit')) {
        // If rate limited, wait longer before continuing
        await sleep(2000);
      }
    }
  }
  
  return matches;
}

// Get TFT League entries by PUUID (platform-specific)
// Returns ranked information including current LP
// platform: vn2, th2, sg2, ph2, tw2, etc.
export async function getTFTLeagueByPuuid(puuid: string, platform: string = 'vn2') {
  const url = `https://${platform}.api.riotgames.com/tft/league/v1/by-puuid/${puuid}`;
  return fetchRiotAPI(url);
}

