export default async function handler(req, res) {
  try {
    const apiKey = process.env.GOOGLE_SOLAR_API_KEY;

    if (!apiKey) {
      console.error("❌ GOOGLE_SOLAR_API_KEY is undefined");
      return res.status(500).json({ error: "GOOGLE_SOLAR_API_KEY is not set" });
    }

    const { lat, lon } = req.query;

    const googleRes = await fetch(
      `https://solar.googleapis.com/v1/dataLayers:findClosest?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: {
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
          },
          requiredQuality: "HIGH",
          view: "FULL_LAYERS",
        }),
      }
    );

    const data = await googleRes.json();
    return res.status(googleRes.status).json(data);
  } catch (err) {
    console.error("Function Error:", err);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}
