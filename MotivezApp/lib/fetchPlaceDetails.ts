import axios from 'axios';

export async function fetchPlaceDetails(placeId: string) {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error('Google API Key not set.');
    return null;
  }

const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=opening_hours,editorial_summary&key=${apiKey}`;
  try {
    const res = await axios.get(url);
    return res.data.result;
  } catch (err) {
    console.error('Error fetching place details:', err);
    return null;
  }
}