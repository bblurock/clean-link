// Run with Sharp available: node scripts/render-icons.cjs
const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");
const root = path.resolve(__dirname, "..");
const names = ["copy", "paste", "clipboard", "rules"];
(async () => {
  await fs.mkdir(path.join(root, "assets", "actions"), { recursive: true });
  const mark = await fs.readFile(path.join(root, "design/icons/clean-link-final-source.png"));
  await sharp(mark).resize(512, 512).png().toFile(path.join(root, "assets/clean-link-final.png"));
  for (const name of names) {
    const svg = await fs.readFile(path.join(root, `design/icons/${name}.svg`), "utf8");
    await sharp(Buffer.from(svg)).png().toFile(path.join(root, `assets/actions/${name}.png`));
    await sharp(Buffer.from(svg.replaceAll("#292923", "#F7F5EE"))).png().toFile(path.join(root, `assets/actions/${name}@dark.png`));
  }
  const embed = (filename, x, y, width, height = width) => fs.readFile(path.join(root, filename)).then((data) =>
    `<image href="data:image/png;base64,${data.toString("base64")}" x="${x}" y="${y}" width="${width}" height="${height}"/>`);
  const images = await Promise.all([
    embed("assets/clean-link-final.png", 58, 122, 224),
    ...[16, 24, 32, 48].map((size, i) => embed("assets/clean-link-final.png", 354 + i * 90, 167 - size / 2, size)),
    ...[16, 24, 32, 48].map((size, i) => embed("assets/clean-link-final.png", 354 + i * 90, 295 - size / 2, size)),
    ...names.map((name, i) => embed(`assets/actions/${name}.png`, 104 + i * 186, 463, 32)),
    ...names.map((name, i) => embed(`assets/actions/${name}@dark.png`, 104 + i * 186, 603, 32)),
  ]);
  const board = `<svg xmlns="http://www.w3.org/2000/svg" width="840" height="770" viewBox="0 0 840 770">
    <rect width="840" height="770" fill="#F7F5EE"/>
    <g fill="#292923" font-family="Helvetica, Arial, sans-serif">
      <text x="58" y="57" font-size="26" font-weight="600">Clean Link / Open Studio</text>
      <text x="58" y="85" font-size="14" fill="#686A60">A small icon family, following benson.lu</text>
      <rect x="324" y="118" width="458" height="102" rx="16" fill="#FFFDF8"/>
      <rect x="324" y="246" width="458" height="102" rx="16" fill="#292923"/>
      ${[16,24,32,48].map((size,i)=>`<text x="${354+i*90}" y="${size===48?212:208}" font-size="10" fill="#686A60">${size}px</text>`).join("")}
      <text x="58" y="386" font-size="14">Paper · Blue · Butter / A clear link and a visible clipped corner</text>
      <path d="M58 412H782" stroke="#D8D9CD"/>
      <text x="58" y="442" font-size="14" fill="#686A60">Action icons / 24px grid · 1.65px strokes</text>
      ${["Copy","Paste","Clipboard","Rules"].map((name,i)=>`<text x="${88+i*186}" y="526" font-size="14">${name}</text>`).join("")}
      <rect x="58" y="566" width="724" height="105" rx="16" fill="#292923"/>
      <text x="58" y="714" font-size="14" fill="#686A60">Theme-aware utility icons. A handmade app identity in light and dark.</text>
      ${images.join("")}
    </g>
  </svg>`;
  await fs.writeFile(path.join(root, "design/icon-preview.svg"), board);
  await sharp(Buffer.from(board)).png().toFile(path.join(root, "design/icon-preview.png"));
  console.log("Rendered app icon, eight action assets, and preview board.");
})().catch((error) => { console.error(error); process.exitCode = 1; });
