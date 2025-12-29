# Hướng dẫn Setup

## 1. Cài đặt Dependencies

```bash
npm install
```

## 2. Cấu hình Environment Variables

Tạo file `.env.local` trong thư mục gốc với nội dung:

```env
# Riot Games API Key
# Lấy từ: https://developer.riotgames.com/
RIOT_API_KEY=your_api_key_here

# Account API uses regional routing (asia for SEA region)
RIOT_API_BASE_URL_ACCOUNT=https://asia.api.riotgames.com

# TFT Match API uses regional routing (sea for SEA region)
RIOT_API_BASE_URL_TFT=https://sea.api.riotgames.com/tft
```

### Lấy Riot API Key:

1. Truy cập [Riot Developer Portal](https://developer.riotgames.com/)
2. Đăng nhập với tài khoản Riot
3. Tạo một ứng dụng mới
4. Copy API key (development key có thời hạn 24 giờ)
5. Paste vào file `.env.local`

### Các Region khác:

**Account API:**
- Americas: `https://americas.api.riotgames.com`
- Europe: `https://europe.api.riotgames.com`
- Asia: `https://asia.api.riotgames.com`

**Match API:**
- Americas: `https://americas.api.riotgames.com/tft`
- Europe: `https://europe.api.riotgames.com/tft`
- Asia: `https://asia.api.riotgames.com/tft`

**Platform codes** (cho Summoner API):
- Vietnam: `vn2`
- Thailand: `th2`
- Singapore: `sg2`
- Philippines: `ph2`
- Taiwan: `tw2`
- North America: `na1`
- Europe West: `euw1`
- Korea: `kr`

## 3. Chạy Development Server

```bash
npm run dev
```

Mở trình duyệt tại: http://localhost:3000

## 4. Luồng API (4 bước)

### Step 1: Get Account by Riot ID
```
GET https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}
```
**Ví dụ:**
```
GET https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/Lians/1211
```
**Response:** `{ puuid, gameName, tagLine }`

### Step 2: Get TFT Summoner by PUUID
```
GET https://{platform}.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/{puuid}
```
**Ví dụ:**
```
GET https://vn2.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/{puuid}
```
**Platform:** `vn2`, `th2`, `sg2`, `ph2`, `tw2`, etc.

### Step 3: Get Match List
```
GET https://sea.api.riotgames.com/tft/match/v1/matches/by-puuid/{puuid}/ids?start=0&count=20
```
**Response:** Array of match IDs

### Step 4: Get Match Details
```
GET https://sea.api.riotgames.com/tft/match/v1/matches/{matchId}
```
**Ví dụ:**
```
GET https://sea.api.riotgames.com/tft/match/v1/matches/VN2_1189852381
```

### API Key:

API key được truyền qua **Header** (khuyến nghị): `X-Riot-Token: YOUR_API_KEY`

## 5. Test API

Bạn có thể test API bằng cách:

1. Tìm kiếm một Riot ID trong ứng dụng (format: `gameName#tagLine`)
2. Hoặc test trực tiếp API endpoints:

```bash
# Step 1: Get account
curl -H "X-Riot-Token: YOUR_API_KEY" \
  "https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/Lians/1211"

# Step 2: Get summoner (sử dụng PUUID từ step 1)
curl -H "X-Riot-Token: YOUR_API_KEY" \
  "https://vn2.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/{puuid}"

# Step 3: Get match list
curl -H "X-Riot-Token: YOUR_API_KEY" \
  "https://sea.api.riotgames.com/tft/match/v1/matches/by-puuid/{puuid}/ids?start=0&count=20"

# Step 4: Get match details
curl -H "X-Riot-Token: YOUR_API_KEY" \
  "https://sea.api.riotgames.com/tft/match/v1/matches/VN2_1189852381"
```

### Hoặc sử dụng endpoint kết hợp:

```bash
# Get full player data (tự động gọi 4 bước)
curl -H "X-Riot-Token: YOUR_API_KEY" \
  "http://localhost:3000/api/player/Lians%231211?platform=vn2&count=20"
```

## Lưu ý

- ⚠️ **KHÔNG commit file `.env.local` lên git** (đã có trong `.gitignore`)
- ⚠️ API key development có thời hạn 24 giờ, cần renew thường xuyên
- ⚠️ API có rate limit, không gọi quá nhiều request cùng lúc
- ✅ Sử dụng production API key cho môi trường production

