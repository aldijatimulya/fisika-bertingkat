// Membuat src/content/modul/index.ts dari semua berkas modul/*.json (dijalankan otomatis sebelum build dan tes).
import { readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../src/content/modul");
const files = readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
const name = (f) => "m_" + f.replace(/\.json$/, "").replace(/[^a-z0-9]/gi, "_");
const out = [
  "// BERKAS DIHASILKAN OTOMATIS oleh tools/gen-modul-index.mjs. Jangan disunting.",
  'import type { RawModule } from "../fromJson";',
  ...files.map((f) => `import ${name(f)} from "./${f}";`),
  `export const RAW_MODULES: Record<string, RawModule> = {`,
  ...files.map((f) => `  ${JSON.stringify(f.replace(/\.json$/, ""))}: ${name(f)} as unknown as RawModule,`),
  "};", "",
].join("\n");
writeFileSync(path.join(dir, "index.ts"), out);
console.log(`modul: ${files.length} berkas`);
