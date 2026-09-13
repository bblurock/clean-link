export interface CleanResult {
  url: string;
  removed: string[];
  notice?: string;
}

export interface CleanOptions {
  additionalParameters?: string;
  keepParameters?: string;
}

export function parseParameterRules(value = ""): string[] {
  const rules = [...new Set(value.toLowerCase().split(/[,\s]+/u).filter(Boolean))];
  for (const rule of rules) {
    if (!/^[a-z0-9_.~-]+\*?$/i.test(rule)) {
      throw new Error("Use parameter names such as campaign_id or track_*, separated by commas. A * is allowed only at the end of a name.");
    }
  }
  return rules;
}

function matchesRule(key: string, rules: string[]): boolean {
  return rules.some((rule) => rule.endsWith("*") ? key.startsWith(rule.slice(0, -1)) : key === rule);
}

export function validateCleanOptions(options: CleanOptions): void {
  parseParameterRules(options.additionalParameters);
  parseParameterRules(options.keepParameters);
}

const commonTrackers = new Set([
  "fbclid", "gclid", "dclid", "gbraid", "wbraid", "msclkid",
  "twclid", "ttclid", "yclid", "li_fat_id", "mc_cid", "mc_eid",
  "_ga", "_gl", "igshid",
]);

function belongsTo(host: string, domain: string): boolean {
  return host === domain || host.endsWith(`.${domain}`);
}

function isTracker(key: string, url: URL): boolean {
  if (key.startsWith("utm_") || commonTrackers.has(key)) return true;
  const host = url.hostname.toLowerCase().replace(/\.$/, "");
  if ((belongsTo(host, "youtube.com") || host === "youtu.be") && key === "si") return true;
  if (belongsTo(host, "instagram.com") && key === "igsh") return true;
  if (belongsTo(host, "facebook.com") && key === "mibextid") return true;
  if (host === "open.spotify.com" && key === "si") return true;
  // On X these are share metadata on status links; `t` remains meaningful elsewhere.
  if ((belongsTo(host, "x.com") || belongsTo(host, "twitter.com")) &&
      /^\/[^/]+\/status\/\d+\/?$/.test(url.pathname) && (key === "s" || key === "t")) return true;
  return false;
}

function decodeKey(part: string): string {
  const key = part.split("=", 1)[0];
  try {
    return decodeURIComponent(key.replace(/\+/g, " "));
  } catch {
    return key;
  }
}

export function cleanUrl(input: string, options: CleanOptions = {}): CleanResult {
  const additional = parseParameterRules(options.additionalParameters);
  const alwaysKeep = parseParameterRules(options.keepParameters);
  const original = input.trim();
  let parsed: URL;
  try {
    parsed = new URL(original);
  } catch {
    throw new Error("Paste a complete link beginning with https:// or http://.");
  }
  if (!/^https?:\/\//i.test(original) || !["http:", "https:"].includes(parsed.protocol) || /[\s\\]/u.test(original)) {
    throw new Error("Paste one complete HTTP or HTTPS link without spaces.");
  }
  const hashAt = original.indexOf("#");
  const fragment = hashAt < 0 ? "" : original.slice(hashAt);
  const beforeHash = hashAt < 0 ? original : original.slice(0, hashAt);
  const queryAt = beforeHash.indexOf("?");
  if (queryAt < 0) return { url: original, removed: [] };
  const parts = beforeHash.slice(queryAt + 1).split("&");
  const keys = parts.map(decodeKey);

  // Editing signed URLs can invalidate access. Keep common signed/token URLs intact.
  if (keys.some((key) => /^(?:sig|signature|token|access_token|auth|authorization|policy|hmac|jwt|x-amz-.+|x-goog-.+)$/i.test(key))) {
    return { url: original, removed: [], notice: "This link may contain an access token or signature, so it was left unchanged." };
  }
  const removed: string[] = [];
  const kept = parts.filter((part, index) => {
    const key = keys[index].toLowerCase();
    if (matchesRule(key, alwaysKeep)) return true;
    if (!isTracker(key, parsed) && !matchesRule(key, additional)) return true;
    removed.push(keys[index]);
    return false;
  });
  if (!removed.length) return { url: original, removed };
  // Do not reserialize URLSearchParams: doing so can alter encoding of retained values.
  const query = kept.join("&");
  return { url: beforeHash.slice(0, queryAt) + (query ? `?${query}` : "") + fragment, removed };
}
