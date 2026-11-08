// اجرا:
//   $env:PEXELS_KEY="کلید"; node fill-thumbnails.mjs esamtest_dishes.filled.json esamtest_dishes.filled.json
// (ورودی و خروجی می‌تواند یک فایل باشد؛ غذاهایی که عکس دارند رد می‌شوند، پس هر چند بار اجرا کنی ادامه می‌دهد.)
import { readFileSync, writeFileSync } from "node:fs";

const [input = "esamtest_dishes.json", output = input] = process.argv.slice(2);
const KEY = process.env.PEXELS_KEY;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchRetry(url, opts = {}) {
  for (let attempt = 1; attempt <= 8; attempt++) {
    const r = await fetch(url, opts);
    if (r.status !== 429) {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r;
    }
    let wait = Number(r.headers.get("retry-after")) * 1000;
    const reset = Number(r.headers.get("x-ratelimit-reset"));
    if (!wait && reset) wait = Math.max(0, reset * 1000 - Date.now()) + 2000;
    if (!wait) wait = 30000 * attempt;
    wait = Math.min(wait, 3700000);
    console.log(`\n429 - صبر ${Math.round(wait / 1000)} ثانیه...`);
    await sleep(wait);
  }
  throw new Error("rate limited");
}

async function pexels(q) {
  const r = await fetchRetry(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=1&orientation=landscape`,
    { headers: { Authorization: KEY } }
  );
  const j = await r.json();
  return j.photos?.[0]?.src?.medium || null;
}

async function commons(q) {
  const u =
    "https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=8" +
    `&gsrsearch=${encodeURIComponent(q + " filetype:bitmap")}&prop=imageinfo&iiprop=url|mime&iiurlwidth=500`;
  const r = await fetchRetry(u, { headers: { "User-Agent": "dishar-thumb-filler/1.1 (personal project)" } });
  const j = await r.json();
  const pages = Object.values(j.query?.pages || {}).sort((a, b) => a.index - b.index);
  const hit = pages.find((p) => p.imageinfo?.[0]?.mime === "image/jpeg");
  return hit?.imageinfo[0].thumburl || null;
}

async function find(name) {
  const queries = [`${name} food`, name];
  for (const q of queries) {
    const url = KEY ? await pexels(q) : await commons(q);
    await sleep(KEY ? 400 : 2500);
    if (url) return url;
  }
  return null;
}

const dishes = JSON.parse(readFileSync(input, "utf8"));
const cache = new Map();
let filled = 0;
const failed = [];

for (const [i, d] of dishes.entries()) {
  if (d.thumbnailUrl) continue;
  try {
    if (!cache.has(d.nameEn)) cache.set(d.nameEn, await find(d.nameEn));
    const url = cache.get(d.nameEn);
    if (url) { d.thumbnailUrl = url; filled++; } else failed.push(d.nameEn);
  } catch (e) {
    failed.push(`${d.nameEn} (${e.message})`);
  }
  process.stdout.write(`\r${i + 1}/${dishes.length}  filled=${filled}  failed=${failed.length}   `);
  if (i % 10 === 0) writeFileSync(output, JSON.stringify(dishes, null, 2));
}

writeFileSync(output, JSON.stringify(dishes, null, 2));
console.log(`\nDone. filled=${filled}, failed=${failed.length}`);
if (failed.length) console.log("Failed:\n" + failed.join("\n"));
