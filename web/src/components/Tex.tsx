import katex from "katex";

/** Render rumus di server (ekspor statis): tanpa JavaScript di peramban. */
export function Tex({ tex, block = false }: { tex: string; block?: boolean }) {
  const html = katex.renderToString(tex, { displayMode: block, throwOnError: false, strict: "ignore", output: "html" });
  return block ? <div dangerouslySetInnerHTML={{ __html: html }} /> : <span dangerouslySetInnerHTML={{ __html: html }} />;
}
