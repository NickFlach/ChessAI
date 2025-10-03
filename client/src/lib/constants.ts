export const MUSIC_GENRES = [
  { value: "indie-pop", label: "Indie Pop" },
  { value: "lo-fi", label: "Lo-Fi Hip Hop" },
  { value: "electronic", label: "Electronic" },
  { value: "rock", label: "Rock" },
  { value: "jazz", label: "Jazz" },
  { value: "classical", label: "Classical" },
  { value: "ambient", label: "Ambient" },
  { value: "pop", label: "Pop" },
  { value: "blues", label: "Blues" },
  { value: "country", label: "Country" },
  { value: "folk", label: "Folk" },
  { value: "metal", label: "Metal" },
  { value: "reggae", label: "Reggae" },
  { value: "trap", label: "Trap" },
  { value: "house", label: "House" },
] as const;

export const MUSIC_MODELS = [
  { value: "V5", label: "Suno V5 (Latest)", description: "Best quality, fastest generation" },
  { value: "V4_5PLUS", label: "Suno V4.5 Plus", description: "Enhanced creative controls" },
  { value: "V4_5", label: "Suno V4.5", description: "Genre blending capabilities" },
  { value: "V4", label: "Suno V4", description: "Refined song structure" },
  { value: "V3_5", label: "Suno V3.5", description: "Creative diversity baseline" },
] as const;

export const QUICK_TAGS = [
  "Upbeat", "Dreamy", "Melancholic", "Energetic", "Chill", "Cinematic",
  "Dark", "Bright", "Nostalgic", "Futuristic", "Romantic", "Epic",
  "Mysterious", "Peaceful", "Intense", "Playful", "Emotional", "Powerful"
] as const;

export const GENERATION_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing", 
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

export const POLLING_INTERVAL = 2000; // 2 seconds
export const MAX_PROMPT_LENGTH = 5000;
