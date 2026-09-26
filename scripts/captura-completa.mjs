// Captura completa de precios en UNA sola orden (en tu PC):
//   node scripts/captura-completa.mjs            (o con --hilos 6 para ir más rápido)
// 1) milanuncios (venta ES) · 2) autoscout24.es (venta ES) · 3) mobile.de (compra DE, desde cero)
// Cada paso guarda su progreso: si se corta, vuelve a lanzar la misma orden y sigue.
// Al terminar, sube la carpeta data/ a la rama arena/01a0d597-car.
import { spawnSync } from 'node:child_process';
import { existsSync, writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
if (!readFileSync('scripts/autoscout-de-scrape.mjs', 'utf8').includes("includes('--es')")) { console.log('✖ Tienes una versión antigua de los scripts. Ejecuta: git checkout -- scripts && git pull origin arena/01a0d597-car'); process.exit(1); }
const REPASO = process.argv.includes('--repasar'); // repite autoscout24.es y mobile.de solo en los grupos que salieron vacíos
const extra = process.argv.slice(2).filter((a) => a !== '--repasar'); // p. ej. --hilos 6 (se pasa a los tres pasos)
const steps = [
  ['milanuncios (España)', ['scripts/milanuncios-scrape.mjs'], 'data/milanuncios/.hecho'],
  ['autoscout24.es (España)', ['scripts/autoscout-de-scrape.mjs', '--es', ...(existsSync('data/autoscout-es/.v2') ? [] : ['--reset'])], 'data/autoscout-es/.hecho'],
  ['mobile.de (Alemania)', ['scripts/mobilede-scrape.mjs', ...(existsSync('data/mobilede/.v4') ? [] : ['--reset'])], 'data/mobilede/.hecho'],
];
for (const [name, args, flag] of steps) {
  if (existsSync(flag) && !(REPASO && !name.startsWith('milanuncios'))) { console.log(`✔ ${name}: ya hecho (borra ${flag} para repetirlo)`); continue; }
  console.log(`\n=== ${name} ===`);
  mkdirSync(dirname(flag), { recursive: true });
  if (name.startsWith('autoscout')) writeFileSync('data/autoscout-es/.v2', '');
  if (name.startsWith('mobile')) writeFileSync('data/mobilede/.v4', '');
  const r = spawnSync(process.execPath, [...args, ...extra], { stdio: 'inherit' });
  if (r.status !== 0) { console.log(`\n✖ ${name} se paró. Vuelve a lanzar: node scripts/captura-completa.mjs`); process.exit(1); }
  mkdirSync(dirname(flag), { recursive: true });
  if (name.startsWith('autoscout') && !existsSync('data/autoscout-es/rows.json')) { console.log('✖ autoscout24.es no generó data/autoscout-es/rows.json'); process.exit(1); }
  writeFileSync(flag, new Date().toISOString());
}
console.log('\nTODO CAPTURADO. Ahora sube los resultados:\n  git add -f data/milanuncios data/autoscout-es data/mobilede\n  git commit -m "Captura completa de precios"\n  git push origin arena/01a0d597-car');
