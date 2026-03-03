/**
 * Read the .env file
 *
 * @param env
 * @param def
 * @returns
 */
export const env = <X = string, Y = undefined> (
  env: string,
  defaultValue?: Y,
): Y extends undefined ? X : Y => {
  let val: string | number | boolean | undefined | null = process.env[env] ?? "";

  if ([true, "true", "on", false, "false", "off"].includes(val)) {
    val = [true, "true", "on"].includes(val);
  }

  if (!isNaN(Number(val)) && typeof val !== "boolean") {
    val = Number(val);
  }

  if (val === "") {
    val = undefined;
  }

  if (val === "null") {
    val = null;
  }

  val ??= defaultValue as typeof val;

  return val as Y extends undefined ? X : Y;
};

/**
 * Build the app url
 *
 * @param link
 * @returns
 */
export const appUrl = (link?: string): string => {
  const port = env("PORT") || "3000";
  const defaultUrl = `http://localhost:${port}`;
  const appUrl = env("APP_URL") ?? defaultUrl;

  try {
    const url = new URL(appUrl);
    // Append port only if APP_URL has a port or is localhost
    if (url.port || url.hostname === "localhost") {
      url.port = port;
    }
    // Remove trailing slash from base URL
    let baseUrl = url.toString().replace(/\/$/, "");
    // Append link with proper path separator
    if (link) {
      // Ensure link starts with '/' and remove duplicate slashes
      const normalizedLink = `/${link.replace(/^\/+/, "")}`;
      return `${baseUrl}${normalizedLink}`;
    }
    return baseUrl;
  } catch {
    // Return default URL with link if provided
    return link ? `${defaultUrl}/${link.replace(/^\/+/, "")}` : defaultUrl;
  }
}; 