import AsyncStorage from '@react-native-async-storage/async-storage';

export interface VibePrefs {
  [vibe: string]: {
    like: number;
    skip: number;
  };
}

const STORAGE_KEY = 'vibe_preferences';

export async function getPreferences(): Promise<VibePrefs> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : {};
  } catch (err) {
    console.error('Failed to load preferences', err);
    return {};
  }
}

export async function updatePreference(vibes: string[], liked: boolean): Promise<void> {
  const prefs = await getPreferences();
  vibes.forEach(v => {
    if (!prefs[v]) {
      prefs[v] = { like: 0, skip: 0 };
    }
    if (liked) {
      prefs[v].like += 1;
    } else {
      prefs[v].skip += 1;
    }
  });

  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch (err) {
    console.error('Failed to save preferences', err);
  }
}

export function calculateScore(vibes: string[], prefs: VibePrefs): number {
  return vibes.reduce((sum, v) => {
    const p = prefs[v];
    if (!p) return sum;
    return sum + (p.like - p.skip);
  }, 0);
}

export async function sortCardsByPreference<T extends { vibes: string[] }>(cards: T[]): Promise<T[]> {
  const prefs = await getPreferences();
  return cards.sort((a, b) => calculateScore(b.vibes, prefs) - calculateScore(a.vibes, prefs));
}