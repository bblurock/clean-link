import assert from "node:assert/strict";
import test from "node:test";
import { cleanUrl, parseParameterRules } from "../src/clean-url.ts";

const cases = [
  ["https://example.com/story?utm_source=fb&fbclid=123&id=42#comments", "https://example.com/story?id=42#comments"],
  ["https://youtu.be/video?si=share&t=42", "https://youtu.be/video?t=42"],
  ["https://www.youtube.com/watch?v=video&list=playlist&index=2&si=share", "https://www.youtube.com/watch?v=video&list=playlist&index=2"],
  ["https://www.instagram.com/reel/ABC/?igsh=share", "https://www.instagram.com/reel/ABC/"],
  ["https://www.facebook.com/story.php?story_fbid=1&id=2&mibextid=abc", "https://www.facebook.com/story.php?story_fbid=1&id=2"],
  ["https://x.com/person/status/123?s=20&t=share", "https://x.com/person/status/123"],
  ["https://open.spotify.com/track/abc?si=share", "https://open.spotify.com/track/abc"],
  ["https://example.com/?si=keep&s=keep&t=42&ref=keep&source=keep", "https://example.com/?si=keep&s=keep&t=42&ref=keep&source=keep"],
  ["https://youtube.com.evil.example/?si=keep&utm_source=remove", "https://youtube.com.evil.example/?si=keep"],
  ["https://x.com/search?t=keep&s=keep", "https://x.com/search?t=keep&s=keep"],
  ["https://example.com/p?q=a%20b&q=a+b&raw=%2f%2F&flag&utm_source=x#x?utm_source=keep", "https://example.com/p?q=a%20b&q=a+b&raw=%2f%2F&flag#x?utm_source=keep"],
  ["https://example.com?UTM_SOURCE=a&%75tm_medium=b&utm_source=c&id=1", "https://example.com?id=1"],
  ["https://example.com?utm_source=x&bad%zz=value", "https://example.com?bad%zz=value"],
  ["https://example.com/file?X-Amz-Signature=abc&utm_source=x", "https://example.com/file?X-Amz-Signature=abc&utm_source=x"],
  ["https://example.com/file?token=secret&utm_source=x", "https://example.com/file?token=secret&utm_source=x"],
  ["https://t.co/abc", "https://t.co/abc"],
  ["https://example.com/#/page?utm_source=keep", "https://example.com/#/page?utm_source=keep"],
  ["  https://example.com/?q=test  ", "https://example.com/?q=test"],
] as const;

for (const [input, expected] of cases) {
  test(input, () => {
    const result = cleanUrl(input);
    assert.equal(result.url, expected);
    assert.equal(cleanUrl(result.url).url, expected, "cleaning should be idempotent");
  });
}

test("reports repeated tracking parameters accurately", () => {
  assert.deepEqual(cleanUrl("https://example.com?utm_source=a&utm_source=b").removed, ["utm_source", "utm_source"]);
});

test("removes additional exact names and prefix rules while preserving other values", () => {
  const result = cleanUrl("https://example.com?p=a%20b&campaign_id=abc&track_source=share&track=keep&mycampaign_id=keep", {
    additionalParameters: "campaign_id, track_*",
  });
  assert.equal(result.url, "https://example.com?p=a%20b&track=keep&mycampaign_id=keep");
  assert.deepEqual(result.removed, ["campaign_id", "track_source"]);
});
test("always keep overrides built-in, site-specific, and custom rules", () => {
  const input = "https://youtu.be/abc?si=a&utm_source=b&campaign_id=c&utm_medium=d";
  const result = cleanUrl(input, { additionalParameters: "campaign_id, si", keepParameters: "si, campaign_id, utm_*" });
  assert.equal(result.url, input);
  assert.deepEqual(result.removed, []);
});
test("supports case-insensitive and encoded custom names and repeated parameters", () => {
  assert.equal(cleanUrl("https://example.com?CAMPAIGN_ID=a&%63ampaign_id=b&id=1", {
    additionalParameters: "Campaign_ID",
  }).url, "https://example.com?id=1");
});
test("custom rules do not override signed-link protection", () => {
  const input = "https://example.com?sig=secret&campaign_id=a&utm_source=b";
  assert.equal(cleanUrl(input, { additionalParameters: "sig, campaign_id" }).url, input);
});
test("accepts commas, whitespace, empty settings, and duplicate names", () => {
  assert.deepEqual(parseParameterRules(" Campaign_ID,\ntrack_* campaign_id ,, "), ["campaign_id", "track_*"]);
  assert.deepEqual(parseParameterRules(), []);
});
for (const rule of ["*", "utm**", "utm_*_id", "?ref", "ref=123", "https://example.com", "(ref)+"]) {
  test(`rejects ambiguous custom rule: ${rule}`, () => {
    assert.throws(() => cleanUrl("https://example.com?ref=123", { additionalParameters: rule }), /parameter names/);
    assert.throws(() => cleanUrl("https://example.com", { keepParameters: rule }), /parameter names/);
  });
}
test("explains protected links", () => {
  assert.match(cleanUrl("https://example.com?sig=abc&utm_source=x").notice!, /unchanged/);
});
for (const input of ["", "not a link", "example.com", "javascript:alert(1)", "file:///tmp/test", "https://", "https:example.com", "https://example.com a second link", "https://example.com\\path"]) {
  test(`rejects invalid input: ${input}`, () => assert.throws(() => cleanUrl(input)));
}
