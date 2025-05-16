export default async function handler(req, res) {
  const { lat, lon } = req.query;

  const response = await fetch(
    `https://solar.googleapis.com/v1/dataLayers:findClosest?key=${process.env.GOOGLE_SOLAR_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: {
          latitude: parseFloat(lat),
          longitude: parseFloat(lon)
        },
        requiredQuality: "HIGH",
        view: "FULL_LAYERS"
      })
    }
  );

  const data = await response.json();
  res.status(response.status).json(data);
}
