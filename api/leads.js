const SHEET_ID = process.env.GOOGLE_SHEET_ID || "1drs8Uuh-stCataWzHTN5sFT0CAIaDmRFLXpmIzTJ0Wo";
const SHEET_RANGE = "Leads_Edson!A:R";

async function getAccessToken() {
  const body = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    grant_type: "refresh_token",
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Google token refresh failed: ${response.status} ${text}`);
  }

  const json = await response.json();
  return json.access_token;
}

function normalizePayload(body) {
  const attribution = body.attribution || {};
  return [
    new Date().toISOString(),
    body.client_id || "empreiteira-gr",
    body.name || body.nome || "",
    body.whatsapp || "",
    body.location || body.bairro_cidade || body.neighborhood || "",
    body.service || body.tipo_obra || "",
    body.timing || body.momento || "",
    body.source || "",
    body.session_id || "",
    attribution.gclid || body.gclid || "",
    attribution.gbraid || body.gbraid || "",
    attribution.wbraid || body.wbraid || "",
    attribution.utm_source || body.utm_source || "",
    attribution.utm_medium || body.utm_medium || "",
    attribution.utm_campaign || body.utm_campaign || "",
    body.page_url || "",
    "novo",
    "",
  ];
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    if ((body.client_id || "empreiteira-gr") !== "empreiteira-gr") {
      return res.status(400).json({ ok: false, error: "Unsupported client_id" });
    }

    const accessToken = await getAccessToken();
    const values = [normalizePayload(body)];
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(SHEET_RANGE)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Sheets append failed: ${response.status} ${text}`);
    }

    const result = await response.json();
    return res.status(200).json({ ok: true, updatedRange: result.updates && result.updates.updatedRange });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
}
