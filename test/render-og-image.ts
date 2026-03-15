/**
 * 测试「Markdown 转图片」的渲染效果
 * 用法：npx tsx test/render-og-image.ts [主题]
 * 主题：default（无样式）、dust（内置 dust）、或 CSS 文件绝对路径（custom）
 * 输出图片保存在 test/output-render-<主题>.png
 */

import { copyFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { markdownToImage } from "../src/og-image.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEST_DIR = join(__dirname);
const SAMPLE_MD = `# 渲染效果测试

这是一段 **加粗** 与 *斜体* 文本，以及 \`行内代码\`。

## 列表与引用

- 列表项一
- 列表项二

> 这是一段引用块，用于查看主题下引用样式。

## 代码块

\`\`\`javascript
function hello(name) {
  console.log("Hello, " + name);
}
hello("World");
\`\`\`

## 表格

| 列A | 列B |
|-----|-----|
| 1   | 2   |
| 3   | 4   |
`;

function sanitizeThemeForFilename(theme: string): string {
  if (!theme || theme === "default" || theme === "none") return "default";
  if (theme === "dust") return "dust";
  return "custom";
}

async function main(): Promise<void> {
  const theme = process.argv[2]?.trim() || "default";
  console.log("主题:", theme || "(default)");

  const outFileUrl = await markdownToImage(SAMPLE_MD, { theme });
  if (!outFileUrl) {
    console.error("生成失败：请安装 satori 和 sharp：npm install satori sharp");
    process.exit(1);
  }

  let sourcePath = outFileUrl.replace(/^file:\/\//i, "");
  if (process.platform === "win32" && sourcePath.startsWith("/")) {
    sourcePath = sourcePath.slice(1).replace(/\//g, "\\");
  }
  try {
    sourcePath = decodeURIComponent(sourcePath);
  } catch {}

  const safeName = sanitizeThemeForFilename(theme);
  const destPath = join(TEST_DIR, `output-render-${safeName}.png`);
  mkdirSync(TEST_DIR, { recursive: true });

  try {
    copyFileSync(sourcePath, destPath);
    console.log("已保存:", destPath);
  } catch (e) {
    console.error("复制失败:", e);
    console.log("临时文件位置:", sourcePath);
    process.exit(1);
  }
}

main();
