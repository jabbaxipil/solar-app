export default async function handler(req, res) {
  try {
    const { lat, lon } = req.query;
    const apiKey = "AIzaSyB9t-BW1mYPQs71c4EzgbzsMUq_TA1h1xU"; // TEMPORARY for testing

    if (!apiKey) {
      return res.status(500).json({ error: "Missing API key" });
    }

    const googleRes = await fetch(
      `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lon}&requiredQuality=HIGH&key=${apiKey}`,
      {
        method: "GET"
      }
    );

    const contentType = googleRes.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const text = await googleRes.text();
      console.error("Non-JSON response from Google:", text);
      return res.status(googleRes.status).json({ error: "Non-JSON response", html: text });
    }

    const data = await googleRes.json();
    return res.status(googleRes.status).json(data);
  } catch (err) {
    console.error("Solar API Proxy Error:", err);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}
