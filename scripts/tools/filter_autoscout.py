"""Limpia data/autoscout/rows.json → data/autoscout/clean.json.
Usa el id de generación que autoscout24 pone en la URL (…cat_ma13gr18387ge63…) para
descartar coches de la generación anterior/siguiente matriculados en años de solape.
Uso: python3 scripts/tools/filter_autoscout.py [--import]"""
import json, re, sys, collections, subprocess
R = json.load(open('data/autoscout/rows.json'))
ge = lambda r: (re.search(r'cat_ma\d+gr\d+ge(\d+)', r[9]) or [None, None])[1]
# Exclusiones comprobadas a mano: generación nueva que empezó dentro del rango de años
BAD = {('Clase C Estate S205', '13'), ('GLC X253', '202')}
DROP_GEN = {'Sportage NQ5'}  # autoscout los etiqueta como QL (ge997): no fiables
cnt = collections.defaultdict(collections.Counter)
for r in R: cnt[r[2]][ge(r)] += 1
keep, why = [], collections.Counter()
seen = set()
for r in R:
    g, c = r[2], ge(r)
    if r[9] in seen: why['duplicado'] += 1; continue
    seen.add(r[9])
    if g in DROP_GEN: why['generación dudosa (Sportage NQ5)'] += 1; continue
    if c is None: why['sin id de generación'] += 1; continue
    if (g, c) in BAD or cnt[g][c] / sum(cnt[g].values()) < 0.10: why['otra generación'] += 1; continue
    keep.append(r)
json.dump(keep, open('data/autoscout/clean.json', 'w'))
print(f'{len(keep)} válidos de {len(R)}', dict(why))
if '--import' in sys.argv:
    subprocess.run([sys.executable, 'scripts/tools/addrows.py', 'data/autoscout/clean.json'], check=True)
