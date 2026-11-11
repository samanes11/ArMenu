import sharp from "sharp";
import { readFile } from "fs/promises";
import path from "path";

export async function blurFromUrl(url: string): Promise<string> {
  try {
    let buf: Buffer;
    if (url.startsWith("/")) {
      buf = await readFile(path.join(process.cwd(), "public", url));
    } else {
      const res = await fetch(url, {
        headers: { "User-Agent": "ArMenu/1.0" },
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) return "";
      buf = Buffer.from(await res.arrayBuffer());
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
