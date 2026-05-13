const isProd = process.env.NODE_ENV === "production";
const fallbackBackendUrl = "http://localhost:8001";

export const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || (isProd ? "" : fallbackBackendUrl);

if (!backendUrl) {
  console.warn(
    "[env] NEXT_PUBLIC_BACKEND_URL is not set in production; requests may fail"
  );
}
