export default async function handler(req, res) {
  try {
    const { lat, lon } = req.query;
    const apiKey = process.env.GOOGLE_SOLAR_API_KEY;

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
          view: "FULL_LAYERS"
        }),
      }
    );

    const contentType = googleRes.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const text = await googleRes.text(); // Try to read error body
      console.error("Google API returned non-JSON:", text);
      return res.status(googleRes.status).json({
        error: "Google API returned non-JSON",
        status: googleRes.status,
      });
    }

    const data = await googleRes.json();
    return res.status(googleRes.status).json(data);
  } catch (err) {
    console.error("Solar API Proxy Error:", err);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}
