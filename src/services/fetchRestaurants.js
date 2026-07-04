export async function fetchNearbyRestaurants(lat, lng) {
  const query = `
    [out:json];
    (
      node["amenity"="restaurant"](around:3000,${lat},${lng});
    );
    out;
  `;

  const response = await fetch(
    "https://overpass-api.de/api/interpreter",
    {
      method: "POST",
      body: query,
    }
  );

  const data = await response.json();

  return data.elements;
}