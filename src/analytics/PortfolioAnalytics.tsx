import { Analytics, type BeforeSendEvent } from "@vercel/analytics/react";

const MEASURABLE_ORIGINS = new Set([
  "github",
  "hola",
  "linkedin",
  "portfolio",
  "productos",
  "referido",
  "servicios",
  "tarjeta",
]);

function privacySafePageView(event: BeforeSendEvent): BeforeSendEvent {
  const url = new URL(event.url);
  const origin = (url.searchParams.get("origin") ?? url.searchParams.get("origen"))?.toLowerCase();

  url.search = "";
  url.hash = "";

  if (origin && MEASURABLE_ORIGINS.has(origin)) {
    url.searchParams.set("origin", origin);
  }

  return { ...event, url: url.toString() };
}

export default function PortfolioAnalytics() {
  return <Analytics beforeSend={privacySafePageView} />;
}
