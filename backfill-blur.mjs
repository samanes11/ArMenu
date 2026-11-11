import { MongoClient } from "mongodb";
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import path from "node:path";

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const col = client.db().collection("dishes");

async function blur(url) {
  try {
    let buf;
    if (url.startsWith("/"))
      buf = await readFile(path.join(process.cwd(), "public", url));
    else {
      const r = await fetch(url, {
        headers: { "User-Agent": "ArMenu/1.0" },
        signal: AbortSignal.timeout(10000),
      });
      if (!r.ok) return "";
      buf = Buffer.from(await r.arrayBuffer());
    }
    const out = await sharp(buf)
      .resize(20, 20, { fit: "inside" })
      .blur()
      .jpeg({ quality: 40 })
      .toBuffer();
    return `data:image/jpeg;base64,${out.toString("base64")}`;
  } catch {
    return "";
  }
}

const dishes = await col
  .find({
    thumbnailUrl: { $nin: ["", null] },
    $or: [{ blurDataUrl: { $exists: false } }, { blurDataUrl: "" }],
  })
  .project({ thumbnailUrl: 1 })
  .toArray();

let done = 0;
for (let i = 0; i < dishes.length; i += 5) {
  await Promise.all(
    dishes.slice(i, i + 5).map(async (d) => {
      const b = await blur(d.thumbnailUrl);
      if (b) {
        await col.updateOne({ _id: d._id }, { $set: { blurDataUrl: b } });
        done++;
      }
    }),
  );
}
console.log(`updated: ${done} / ${dishes.length}`);
await client.close();
