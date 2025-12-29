# TFT Match History

Web application to view Teamfight Tactics (TFT) match history using Next.js and Riot Games API.

## Features

- 🔍 Search summoner by Riot ID
- 📊 View TFT match history
- 🎯 Display detailed match information:
  - Placement ranking
  - Traits used
  - Level, gold, damage
  - Match duration
- 🖼️ Full image support for champions, items, and traits
- 📱 Responsive row layout

## Installation

1. Clone repository:
```bash
git clone <repository-url>
cd match-history
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` from `env.example`:
```bash
cp env.example .env.local
```

4. Get Riot API Key:
   - Register at [Riot Developer Portal](https://developer.riotgames.com/)
   - Copy API key to `.env.local`:
   ```
   RIOT_API_KEY=your_api_key_here
   ```

5. Run development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create `.env.local` file with:

```env
# Riot Games API Key
RIOT_API_KEY=your_api_key_here

# Account API uses regional routing (asia for SEA region)
RIOT_API_BASE_URL_ACCOUNT=https://asia.api.riotgames.com

# TFT Match API uses regional routing (sea for SEA region)
RIOT_API_BASE_URL_TFT=https://sea.api.riotgames.com/tft
```

### Other Regions:

- **Americas**: `https://americas.api.riotgames.com`
- **Europe**: `https://europe.api.riotgames.com`
- **Asia**: `https://asia.api.riotgames.com`

### API Flow (4 steps):

1. **Account API** - Get PUUID from Riot ID (gameName#tagLine):
   ```
   GET https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}
   ```

2. **Summoner API** - Get summoner info from PUUID (platform-specific):
   ```
   GET https://{platform}.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/{puuid}
   ```
   Platform: `vn2`, `th2`, `sg2`, `ph2`, `tw2`, etc.

3. **Match List API** - Get list of match IDs:
   ```
   GET https://sea.api.riotgames.com/tft/match/v1/matches/by-puuid/{puuid}/ids?start=0&count=20
   ```

4. **Match Details API** - Get match details:
   ```
   GET https://sea.api.riotgames.com/tft/match/v1/matches/{matchId}
   ```

## Rate Limiting

The application includes built-in rate limit handling:

- **Automatic retry** with exponential backoff
- **Sequential fetching** for match details (with delays)
- **Error messages** for rate limit errors
- **Default match count** reduced to 10 to avoid limits

### Rate Limit Tips:

- Development API keys have **100 requests per 2 minutes**
- Production API keys have higher limits
- The app automatically retries up to 3 times with delays
- Match fetching is sequential with 150ms delays between requests

## Project Structure

```
match-history/
├── app/
│   ├── api/              # API routes
│   │   ├── account/      # Get account info
│   │   ├── summoner/     # Get summoner info
│   │   ├── matches/       # Get match history
│   │   └── player/        # Combined endpoint
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Main page
│   └── globals.css       # Global styles
├── components/
│   ├── MatchCard.tsx     # Match row component
│   ├── MatchHistory.tsx  # Match list component
│   └── SummonerSearch.tsx # Search component
├── lib/
│   ├── riot-api.ts       # Riot API client
│   └── ddragon.ts        # Data Dragon CDN helpers
├── types/
│   └── tft.ts            # TypeScript types
├── env.example           # Environment template
└── package.json
```

## API Endpoints

### `/api/player/[riotId]` (Recommended)
Get full player data (account + summoner + matches) following the correct API flow.

**Format:** `gameName#tagLine` (e.g., `Lians#1211`)

**Query params:**
- `platform` (optional): Platform code (default: `vn2`)
- `start` (optional): Start index for match list (default: `0`)
- `count` (optional): Number of matches (default: `10`)

**Example:**
```
GET /api/player/Lians%231211?platform=vn2&count=10
```

### Other Endpoints

- `/api/account/[gameName]/[tagLine]` - Get account (Step 1)
- `/api/summoner/[puuid]` - Get summoner (Step 2)
- `/api/matches/[puuid]` - Get matches (Step 3 + 4)

## Technologies

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Riot Games API** - TFT match data
- **Data Dragon CDN** - Champion/item/trait images

## Notes

- ⚠️ API key has rate limits, manage carefully
- ⚠️ Do NOT commit `.env.local` to git
- ⚠️ Development API keys expire after 24 hours
- ⚠️ Use correct base URL for your region (SEA, Americas, Europe, Asia)
- ✅ Automatic retry on rate limit errors
- ✅ Sequential fetching to avoid rate limits

## Future Improvements

- [ ] Add caching for match data
- [ ] Add filters by date/time
- [ ] Display detailed unit and item information
- [ ] Add statistics overview (win rate, avg placement)
- [ ] Compare with other players
- [ ] Export data functionality
