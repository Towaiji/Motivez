import AsyncStorage from '@react-native-async-storage/async-storage';

export interface VibePrefs {
  [vibe: string]: {
    like: number;
    skip: number;
  };
}

const STORAGE_KEY = 'vibe_preferences';
const MODEL_KEY = 'vibe_ml_model';
const LEARNING_RATE = 0.1;

export interface MLModel {
  weights: { [vibe: string]: number };
  bias: number;
}

export async function getPreferences(): Promise<VibePrefs> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : {};
  } catch (err) {
    console.error('Failed to load preferences', err);
    return {};
  }
}

export async function getModel(): Promise<MLModel> {
  try {
    const json = await AsyncStorage.getItem(MODEL_KEY);
    return json ? JSON.parse(json) : { weights: {}, bias: 0 };
  } catch (err) {
    console.error('Failed to load ML model', err);
    return { weights: {}, bias: 0 };
  }
}

async function saveModel(model: MLModel): Promise<void> {
  try {
    await AsyncStorage.setItem(MODEL_KEY, JSON.stringify(model));
  } catch (err) {
    console.error('Failed to save ML model', err);
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

  // Update ML model using simple logistic regression
  const model = await getModel();
  const y = liked ? 1 : 0;
  // ensure weights exist
  vibes.forEach(v => {
    if (model.weights[v] === undefined) {
      model.weights[v] = 0;
    }
  });

  let z = model.bias;
  vibes.forEach(v => {
    z += model.weights[v] || 0;
  });
  const pred = 1 / (1 + Math.exp(-z));
  const error = pred - y;

  model.bias -= LEARNING_RATE * error;
  vibes.forEach(v => {
    model.weights[v] -= LEARNING_RATE * error;
  });

  await saveModel(model);
}

export function calculateScore(vibes: string[], prefs: VibePrefs): number {
  return vibes.reduce((sum, v) => {
    const p = prefs[v];
    if (!p) return sum;
    return sum + (p.like - p.skip);
  }, 0);
}

export function predictPreference(vibes: string[], model: MLModel): number {
  let z = model.bias;
  vibes.forEach(v => {
    z += model.weights[v] || 0;
  });
  return 1 / (1 + Math.exp(-z));
}

export async function sortCardsByPreference<T extends { vibes: string[] }>(cards: T[]): Promise<T[]> {
  const model = await getModel();
  return cards.sort((a, b) => predictPreference(b.vibes, model) - predictPreference(a.vibes, model));
}