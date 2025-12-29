// Data Dragon CDN helper functions
// CDN Base URL: https://ddragon.leagueoflegends.com/cdn/

let cachedVersion: string | null = null;

// Get latest Data Dragon version
async function getLatestVersion(): Promise<string> {
  if (cachedVersion) {
    return cachedVersion;
  }

  try {
    const response = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
    const versions: string[] = await response.json();
    cachedVersion = versions[0]; // First element is the latest version
    return cachedVersion;
  } catch (error) {
    console.warn('Failed to fetch latest version, using fallback:', error);
    // Fallback to a recent version
    return '15.24.1';
  }
}

// Get version (cached or fetch)
export async function getDDVersion(): Promise<string> {
  return getLatestVersion();
}

// Base URL helper
async function getBaseUrl(): Promise<string> {
  const version = await getLatestVersion();
  return `https://ddragon.leagueoflegends.com/cdn/${version}`;
}

// Get champion image URL
// character_id format: TFT16_Kaisa
export async function getChampionImageUrl(characterId: string): Promise<string> {
  const baseUrl = await getBaseUrl();
  // Format: TFT16_Kaisa -> TFT16_Kaisa.TFT_Set16.png
  const imageName = `${characterId}.TFT_Set16.png`;
  return `${baseUrl}/img/tft-champion/${imageName}`;
}

// Extract champion name from character_id
// TFT16_Kaisa -> Kaisa, TFT16_BaronNashor -> BaronNashor
function extractChampionName(characterId: string): string {
  // Remove TFT16_ or TFT\d+_ prefix
  return characterId.replace(/^TFT\d+_/, '');
}

// Get fallback image URL from ap.tft.tools
// Format: https://ap.tft.tools/img/face/{character_id_lowercase}.jpg?w=80
export function getFallbackChampionImageUrl(characterId: string, width: number = 80): string {
  // Convert to lowercase for ap.tft.tools format
  const normalizedId = characterId.toLowerCase();
  return `https://ap.tft.tools/img/face/${normalizedId}.jpg?w=${width}`;
}

// Get fallback trait image URL from ap.tft.tools
// Format: https://ap.tft.tools/static/trait-icons/{trait_name}_{tier}.svg
export function getFallbackTraitImageUrl(traitName: string, tier: number = 1, width?: number): string {
  // Convert TFT16_Piltover -> tft16_piltover
  const normalizedName = traitName.toLowerCase();
  // Format: tft16_piltover_3.svg
  return `https://ap.tft.tools/static/trait-icons/${normalizedName}_${tier}.svg`;
}

// Get fallback item image URL
export function getFallbackItemImageUrl(itemId: number | string, width: number = 80): string {
  const normalizedId = typeof itemId === 'string' ? itemId.toLowerCase() : itemId.toString();
  return `https://ap.tft.tools/img/item/${normalizedId}.jpg?w=${width}`;
}

// Get champion image URL (synchronous version with version parameter)
// Tries multiple formats: /img/champion/ and /img/tft-champion/
export function getChampionImageUrlSync(characterId: string, version?: string): string {
  const v = version || '15.24.1';
  const baseUrl = `https://ddragon.leagueoflegends.com/cdn/${v}`;
  
  // Extract champion name (remove TFT16_ prefix)
  const championName = extractChampionName(characterId);
  
  // Try standard champion path first (works for most champions)
  // Format: /img/champion/{championName}.png
  return `${baseUrl}/img/champion/${championName}.png`;
  
  // Alternative: If above doesn't work, try TFT-specific path
  // return `${baseUrl}/img/tft-champion/${characterId}.png`;
}

// Get trait image URL
// trait name format: TFT16_Void
export async function getTraitImageUrl(traitName: string): Promise<string> {
  const baseUrl = await getBaseUrl();
  // Remove TFT16_ prefix and format
  const cleanName = traitName.replace(/^TFT\d+_/, '');
  const imageName = `${traitName}.png`;
  return `${baseUrl}/img/tft-trait/${imageName}`;
}

// Get trait image URL (synchronous version)
// Priority: ap.tft.tools (more reliable) -> Data Dragon
export function getTraitImageUrlSync(traitName: string, tier: number = 1, version?: string): string {
  // Use ap.tft.tools as primary source (more reliable for TFT)
  // Format: https://ap.tft.tools/static/trait-icons/{trait_name}_{tier}.svg
  const normalizedName = traitName.toLowerCase();
  return `https://ap.tft.tools/static/trait-icons/${normalizedName}_${tier}.svg`;
  
  // Fallback to Data Dragon if needed (commented out, using ap.tft.tools first)
  // const v = version || '15.24.1';
  // const baseUrl = `https://ddragon.leagueoflegends.com/cdn/${v}`;
  // return `${baseUrl}/img/tft-trait/${traitName}.png`;
}

// Get item image URL
// item ID format: number or string like "TFT_Item_InfinityEdge"
export async function getItemImageUrl(itemId: number | string): Promise<string> {
  const baseUrl = await getBaseUrl();
  if (typeof itemId === 'string') {
    // Handle string item IDs like "TFT_Item_InfinityEdge"
    return `${baseUrl}/img/item/${itemId}.png`;
  }
  return `${baseUrl}/img/item/${itemId}.png`;
}

// Extract item name from itemId
function extractItemName(itemId: number | string): string {
  if (typeof itemId === 'string') {
    // Remove TFT_Item_ prefix if present
    // "TFT_Item_InfinityEdge" -> "InfinityEdge"
    // "InfinityEdge" -> "InfinityEdge"
    return itemId.replace(/^TFT_Item_/, '');
  }
  // For numeric IDs, we'll need a mapping or use the number directly
  // For now, return as string
  return itemId.toString();
}

// Get item image URL (synchronous version)
// Priority: ap.tft.tools -> Data Dragon
export function getItemImageUrlSync(itemId: number | string, version?: string): string {
  // Use ap.tft.tools as primary source
  // Format: https://ap.tft.tools/img/items_s14/{itemName}.png?w=28
  const itemName = extractItemName(itemId);
  return `https://ap.tft.tools/img/items_s14/${itemName}.png?w=28`;
  
  // Fallback to Data Dragon if needed (commented out, using ap.tft.tools first)
  // const v = version || '15.24.1';
  // if (typeof itemId === 'string') {
  //   return `https://ddragon.leagueoflegends.com/cdn/${v}/img/item/${itemId}.png`;
  // }
  // return `https://ddragon.leagueoflegends.com/cdn/${v}/img/item/${itemId}.png`;
}

// Get companion/pet (Little Legend) image URL
// companion format: { content_ID, item_ID, skin_ID, species }
export async function getCompanionImageUrl(companion: {
  content_ID?: string;
  item_ID?: number;
  skin_ID?: number;
  species?: string;
}): Promise<string> {
  const baseUrl = await getBaseUrl();
  
  // Try to construct from available data
  if (companion.content_ID) {
    // Format might vary, try common patterns
    return `${baseUrl}/img/tft-tactician/${companion.content_ID}.png`;
  }
  
  if (companion.species) {
    // Fallback to species-based naming
    return `${baseUrl}/img/tft-tactician/${companion.species}.png`;
  }
  
  // Default fallback
  return `${baseUrl}/img/tft-tactician/default.png`;
}

// Get companion image URL (synchronous version)
// Tries multiple naming patterns
export function getCompanionImageUrlSync(
  companion: {
    content_ID?: string;
    item_ID?: number;
    skin_ID?: number;
    species?: string;
  },
  version?: string
): string {
  // Use ap.tft.tools as primary source
  // Format: https://ap.tft.tools/img/ll-icons/{content_ID}.png?w=68
  if (companion.content_ID) {
    return `https://ap.tft.tools/img/ll-icons/${companion.content_ID}.png?w=68`;
  }
  
  // Fallback to Data Dragon if content_ID not available
  const v = version || '15.24.1';
  const baseUrl = `https://ddragon.leagueoflegends.com/cdn/${v}/img/tft-tactician`;
  
  // Try species-based naming
  if (companion.species) {
    const species = companion.species;
    return `${baseUrl}/${species}.png`;
  }
  
  // Default fallback (will likely fail, but component will handle it)
  return `${baseUrl}/default.png`;
}

// Legacy functions for backward compatibility (using sync versions)
export function getChampionImageUrlAlt(characterId: string): string {
  return getChampionImageUrlSync(characterId);
}

export function getItemImageUrlAlt(itemId: number | string): string {
  return getItemImageUrlSync(itemId);
}

export function getTraitImageUrlAlt(traitName: string): string {
  return getTraitImageUrlSync(traitName);
}
