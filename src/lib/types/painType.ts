export type PainTypeCode =
  | 'pulsatile'
  | 'burning'
  | 'electric'
  | 'sharp'
  | 'deep'
  | 'stiffness'
  | 'tenderness'
  | 'unknown';

export const PainTypeLabels: Record<PainTypeCode, string> = {
  pulsatile: 'Pulsátil',
  burning: 'Ardor',
  electric: 'Eléctrico',
  sharp: 'Punzante',
  deep: 'Profundo',
  stiffness: 'Rigidez',
  tenderness: 'Sensibilidad al tacto',
  unknown: 'Desconocido',
};

export const ALL_PAIN_TYPES: PainTypeCode[] = [
  'pulsatile',
  'burning',
  'electric',
  'sharp',
  'deep',
  'stiffness',
  'tenderness',
  'unknown',
];

export function isValidPainType(code: string): code is PainTypeCode {
  return (ALL_PAIN_TYPES as string[]).includes(code);
}
