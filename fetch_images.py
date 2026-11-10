#!/usr/bin/env python3
"""
دانلود عکس واقعی غذا از Wikimedia Commons (بدون نیاز به ثبت‌نام یا API key).

استفاده:
  pip install requests
  python fetch_images.py esamtest.dishes.json ./public/dishes

خروجی: عکس‌ها (jpg، عرض ۸۰۰)، esamtest.dishes.images.json، و credits.json (عکاس + لایسنس).
آیتم‌هایی که thumbnailUrl واقعی (/uploads/...) دارند دست نمی‌خورند.
"""
import json, os, re, sys, time, requests

src, outdir = sys.argv[1], sys.argv[2]
os.makedirs(outdir, exist_ok=True)
data = json.load(open(src, encoding="utf-8"))
CREDITS_FILE = "credits.json"
credits = json.load(open(CREDITS_FILE, encoding="utf-8")) if os.path.exists(CREDITS_FILE) else {}

# عبارت جستجوی بهتر برای غذاهایی که نام انگلیسی‌شان مبهم است
Q = {
 "Mast-o-Khiar": "persian yogurt cucumber dip", "Kashk-e Bademjan": "persian eggplant dip",
 "Ash Reshteh": "persian noodle soup", "Doogh": "yogurt drink glass", "Faloodeh": "persian faloodeh dessert",
 "Ghormeh Sabzi": "ghormeh sabzi", "Gheymeh": "gheymeh stew", "Tahchin": "tahchin rice cake",
 "Halim": "halim porridge", "Persian Tea": "persian tea glass", "Saffron Tea": "saffron tea",
 "Bitter Orange Blossom Tea": "herbal tea cup", "Relax Herbal Tea": "herbal tea cup",
 "Mirza Ghasemi": "mirza ghasemi", "Shirazi Salad": "shirazi salad cucumber tomato",
 "Zereshk Polo with Chicken": "zereshk polo", "Baghali Polo with Lamb Shank": "lamb shank rice",
 "Koobideh Kebab with Rice": "koobideh kebab rice", "Chicken Kebab with Rice": "chicken kebab rice",
 "Barg Kebab with Rice": "barg kebab rice", "Persian Breakfast": "persian breakfast",
 "Koobideh Sandwich": "kebab sandwich", "Red Velvet": "red velvet cake slice",
}

if os.path.exists("overrides.json"):
    Q.update(json.load(open("overrides.json", encoding="utf-8")))

def query(d):
    n = d["nameEn"]
    if n in Q: return Q[n]
    n = re.sub(r"\(.*?\)", "", n).strip()
    return n + " food"

def slug(i, d):
    return f"{i+1:03d}-" + re.sub(r"[^a-z0-9]+", "-", d["nameEn"].lower()).strip("-")

API = "https://commons.wikimedia.org/w/api.php"
H = {"User-Agent": "ArMenuImageFetcher/1.0 (student project)"}
BAD = ("menu", "poster", "logo", "map", "cover", "flag", "diagram", "stamp", "book", "page", "painting", "drawing", "svg")

def get(url, **kw):
    """درخواست با ۵ بار تلاش مجدد (برای اینترنت ناپایدار)"""
    for t in range(5):
        try:
            r = requests.get(url, headers=H, timeout=45, **kw)
            if r.status_code == 429: time.sleep(20); continue
            r.raise_for_status(); return r
        except Exception as e:
            print(f"   ⏳ تلاش {t+1}/5 ناموفق: {type(e).__name__}"); time.sleep(3 * (t + 1))
    return None

def search(q):
    r = get(API, params={
        "action": "query", "format": "json", "generator": "search", "gsrsearch": q + " filetype:bitmap",
        "gsrnamespace": 6, "gsrlimit": 15, "prop": "imageinfo",
        "iiprop": "url|size|mime|extmetadata", "iiurlwidth": 800})
    if r is None: return None
    try:
        pages = (r.json().get("query") or {}).get("pages", {})
    except ValueError:                      # پاسخ خالی/HTML (فیلتر یا rate limit)
        print("   ⚠️ پاسخ نامعتبر از سرور، ۱۰ ثانیه صبر..."); time.sleep(10); return None
    out = []
    for p in sorted(pages.values(), key=lambda x: x.get("index", 99)):
        ii = (p.get("imageinfo") or [{}])[0]
        title = p["title"].lower()
        if p["title"] in USED: continue
        if ii.get("mime") != "image/jpeg" or any(b in title for b in BAD): continue
        if ii.get("width", 0) < 800 or ii["width"] < ii.get("height", 0): continue
        out.append((p["title"], ii))
    return out

def save():
    json.dump(data, open("esamtest.dishes.images.json", "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    json.dump(credits, open(CREDITS_FILE, "w", encoding="utf-8"), ensure_ascii=False, indent=2)

USED = {c.get("title") for c in credits.values()}
failed = []
for i, d in enumerate(data):
    if d.get("thumbnailUrl", "").startswith("/uploads/"):
        continue
    fn = slug(i, d) + ".jpg"
    path = os.path.join(outdir, fn)
    if os.path.exists(path):                      # قبلاً دانلود شده → رد شو (resume)
        d["thumbnailUrl"] = f"/dishes/{fn}"; continue
    found = None
    for q in (query(d), d["nameEn"] + " dish"):
        res = search(q)
        if res: found = res[0]; break
        time.sleep(0.3)
    if not found:
        print("❌ پیدا نشد:", d["nameEn"]); failed.append(d["nameEn"]); continue
    title, ii = found
    USED.add(title)
    img = get(ii["thumburl"])
    if img is None:
        print("❌ دانلود نشد:", d["nameEn"]); failed.append(d["nameEn"]); continue
    open(path, "wb").write(img.content)
    d["thumbnailUrl"] = f"/dishes/{fn}"
    m = ii.get("extmetadata", {})
    credits[fn] = {"dish": d["nameEn"], "title": title,
                   "author": re.sub("<.*?>", "", m.get("Artist", {}).get("value", "")),
                   "license": m.get("LicenseShortName", {}).get("value", ""), "page": ii["descriptionurl"]}
    print("✅", d["nameEn"], "←", title)
    save(); time.sleep(0.6)

save()
print("\nتمام شد. ناموفق:", len(failed), failed)
print("اگر خطا بود دوباره همین دستور را اجرا کن؛ فقط مواردی که مانده دانلود می‌شوند.")