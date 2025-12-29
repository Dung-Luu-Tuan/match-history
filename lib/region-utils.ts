// Region to Platform mapping
export const regionToPlatform: Record<string, string> = {
  vn: 'vn2',
  th: 'th2',
  sg: 'sg2',
  ph: 'ph2',
  tw: 'tw2',
  na: 'na1',
  euw: 'euw1',
  eune: 'eun1',
  kr: 'kr',
  jp: 'jp1',
  br: 'br1',
  lan: 'la1',
  las: 'la2',
  oce: 'oc1',
  ru: 'ru',
  tr: 'tr1',
};

export function getPlatformFromRegion(region: string): string {
  return regionToPlatform[region.toLowerCase()] || 'vn2';
}

