// اجرا (از ریشه‌ی پروژه، کنار package.json):
//   node --env-file=.env.local update-thumbs.mjs esamtest.dishes.images.json
// فقط فیلد thumbnailUrl را آپدیت می‌کند؛ بقیه‌ی داده‌ها (available، قیمت و ...) دست نمی‌خورند.
import { readFileSync } from "node:fs";
import { MongoClient, ObjectId } from "mongodb";

const file = process.argv[2];
const data = JSON.parse(readFileSync(file, "utf8"));
const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const col = client.db().collection("dishes");   // اسم دیتابیس از خود MONGODB_URI می‌آید

const ops = data
  .filter((d) => d.thumbnailUrl)
  .map((d) => ({ updateOne: { filter: { _id: new ObjectId(d._id.$oid) }, update: { $set: { thumbnailUrl: d.thumbnailUrl } } } }));

const r = await col.bulkWrite(ops);
console.log(`matched: ${r.matchedCount} / ${ops.length}, modified: ${r.modifiedCount}`);
await client.close();
