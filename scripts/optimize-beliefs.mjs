// Turns your raw pictures into 600x600 .webp files for the 28 beliefs.
//
// 1. Put your pictures in the folder  raw-beliefs/  (project root, next to package.json).
//    Name each one starting with its belief number: 1.jpg, 02.png, 03-god-the-father.jpeg ...
// 2. Run:  npm run images:beliefs
// 3. Results go to  public/beliefs/01.webp ... 28.webp  (the website picks them up automatically).
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const IN = 'raw-beliefs';
const OUT = 'public/beliefs';
const SIZE = 600;

await fs.mkdir(OUT, { recursive: true });
const files = (await fs.readdir(IN)).filter((f) => /\.(jpe?g|png|webp|avif|tiff?)$/i.test(f));
let done = 0;

for (const file of files) {
  const num = parseInt(file, 10);
  if (!(num >= 1 && num <= 28)) { console.warn(`skip  ${file}  (name must start with a number 1-28)`); continue; }
  const out = path.join(OUT, `${String(num).padStart(2, '0')}.webp`);
  await sharp(path.join(IN, file))
    .rotate()                                   // respect phone camera orientation
    .resize(SIZE, SIZE, { fit: 'cover', position: 'attention' }) // crop square around the interesting part
    .webp({ quality: 80 })
    .toFile(out);
  console.log(`ok    ${file}  ->  ${out}`);
  done++;
}
console.log(`\n${done} picture(s) ready. Missing numbers will show the icon instead.`);
