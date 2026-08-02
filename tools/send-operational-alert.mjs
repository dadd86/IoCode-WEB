const webhookUrl = process.env.ALERT_WEBHOOK_URL || "";
const severity = process.env.ALERT_SEVERITY || "P1";
const eventName = process.env.ALERT_EVENT || "production-monitor-failure";
const runUrl = process.env.ALERT_RUN_URL || "";

if (!webhookUrl) {
  console.log("Operational alert skipped: ALERT_WEBHOOK_URL is not configured.");
  process.exit(0);
}

const parsedWebhook = new URL(webhookUrl);
if (parsedWebhook.protocol !== "https:") {
  throw new Error("ALERT_WEBHOOK_URL must use HTTPS.");
}

const payload = {
  service: "iocode-solutions",
  environment: "production",
  severity,
  event: eventName,
  occurredAt: new Date().toISOString(),
  runUrl
};

const response = await fetch(parsedWebhook, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(payload),
  signal: AbortSignal.timeout(10000)
});

if (!response.ok) {
  throw new Error(`Alert webhook returned HTTP ${response.status}.`);
}

await response.body?.cancel();
console.log(`Operational alert delivered (${severity}:${eventName}).`);
