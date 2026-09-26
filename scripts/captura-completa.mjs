// Captura completa de precios en UNA sola orden (en tu PC):
//   node scripts/captura-completa.mjs
// 1) milanuncios (venta ES) · 2) autoscout24.es (venta ES) · 3) mobile.de (compra DE, desde cero)
// Cada paso guarda su progreso: si se corta, vuelve a lanzar la misma orden y sigue.
// Al terminar, sube la carpeta data/ a la rama arena/01a0d597-car.
import { spawnSync } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
const steps = [
  ['milanuncios (España)', ['scripts/milanuncios-scrape.mjs'], 'data/milanuncios/.hecho'],
  ['autoscout24.es (España)', ['scripts/autoscout-de-scrape.mjs', '--es'], 'data/autoscout-es/.hecho'],
  ['mobile.de (Alemania)', ['scripts/mobilede-scrape.mjs', ...(existsSync('data/mobilede/.v4') ? [] : ['--reset'])], 'data/mobilede/.hecho'],
];
for (const [name, args, flag] of steps) {
  if (existsSync(flag)) { console.log(`✔ ${name}: ya hecho (borra ${flag} para repetirlo)`); continue; }
  console.log(`\n=== ${name} ===`);
  if (name.startsWith('mobile')) writeFileSync('data/mobilede/.v4', '');
  const r = spawnSync(process.execPath, args, { stdio: 'inherit' });
  if (r.status !== 0) { console.log(`\n✖ ${name} se paró. Vuelve a lanzar: node scripts/captura-completa.mjs`); process.exit(1); }
  writeFileSync(flag, new Date().toISOString());
}
console.log('\nTODO CAPTURADO. Ahora sube los resultados:\n  git add -f data/milanuncios data/autoscout-es data/mobilede\n  git commit -m "Captura completa de precios"\n  git push origin arena/01a0d597-car');
