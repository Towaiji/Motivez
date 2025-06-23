// lib/fetchNearbyPlaces.ts
import axios from 'axios';

export async function fetchNearbyPlaces(
  lat: number,
  lng: number,
  type: string = 'tourist_attraction',
  radius: number = 10000
) {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error("Google API Key not set.");
    return [];
  }

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${apiKey}`;

  try {
    const res = await axios.get(url);
    return res.data.results;
  } catch (err) {
    console.error("Error fetching Google places:", err);
    return [];
  }
}

export async function fetchPlacesByTextSearch(
  query: string,
  lat: number,
  lng: number,
  radius: number = 20000
) {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error("Google API Key not set.");
    return [];
  }

  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
    query
  )}&location=${lat},${lng}&radius=${radius}&key=${apiKey}`;

  try {
    const res = await axios.get(url);
    return res.data.results;
  } catch (err) {
    console.error("Error fetching text search places:", err);
    return [];
  }
}

