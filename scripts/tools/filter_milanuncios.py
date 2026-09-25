#!/usr/bin/env python3
"""Limpia data/milanuncios/rows.json antes de importarlo a marketEvidence.js.

  python3 scripts/tools/filter_milanuncios.py            -> informe + data/milanuncios/clean.json
  python3 scripts/tools/filter_milanuncios.py --import   -> además lo añade con addrows.py

Filtros (el JSON no trae título, así que se usa el slug de la URL):
  * fuera Seat y Cupra (se fabrican en España: no compensa importarlos)
  * el slug debe nombrar el modelo del grupo (evita Clase GLC dentro de Clase E, Serie 3 en Serie 1...)
  * carrocería: familiares sólo en su grupo familiar y viceversa; fuera Sportback/Coupé/Cabrio/GT/
    Gran Turismo/Active/Gran Tourer/All-Terrain/Sportsvan cuando no son el modelo del grupo
  * fuera anuncios que ya están en marketEvidence (mismo id)
  * mismo coche repetido por un concesionario en varias sedes (gen+año+km+precio)
  * precios atípicos: fuera de 0,55-1,7 × la mediana del grupo para ese año
"""
import json, re, sys, subprocess, statistics, unicodedata, collections

ROWS = 'data/milanuncios/rows.json'
EVID = 'src/data/catalog/marketEvidence.js'
BODY = ['touring sports', 'touring', 'variant', 'avant', 'estate', 'combi', 'st']
OTHER = ['sportback', 'coupe', 'cabrio', 'gran-turismo', 'gran-coupe', 'gt', 'active-tourer',
         'gran-tourer', 'all-terrain', 'sportsvan', 'alltrack', 'scout', 'gtd', 'gti', 'r-line-gt']
BODY_SLUG = {'touring sports': ['touring', 'ts'], 'touring': ['touring'], 'variant': ['variant'],
             'avant': ['avant'], 'estate': ['estate', 'familiar'], 'combi': ['combi'], 'st': ['st']}
ALLOWED = {'Serie 4': {'coupe', 'gran-coupe'}, 'A5': {'coupe', 'sportback'}}

slug = lambda s: re.sub(r'[^a-z0-9]+', '-', unicodedata.normalize('NFD', s.lower()).encode('ascii', 'ignore').decode()).strip('-')

def split_model(model):
  m = model.lower()
  for b in BODY:
    if m.endswith(' ' + b):
      return slug(model[:-len(b) - 1]), b
  return slug(model), None

def ok(r):
  brand, model, gen, url = r[0], r[1], r[2], r[9]
  if brand in ('Seat', 'Cupra'):
    return 'seat/cupra'
  s = '-' + url.rsplit('/', 1)[-1].rsplit('-', 1)[0] + '-'
  base, body = split_model(model)
  if f'-{base}-' not in s:
    return 'otro modelo'
  words = set(s.strip('-').split('-'))
  joined = s
  if body:
    if not any(f'-{w}-' in joined for w in BODY_SLUG[body]) and not re.search(rf'-{base}-\d+\.htm', url):
      # slug genérico ("bmw-serie-3-6123.htm") → no se puede saber la carrocería
      if len(words) > 4:
        return 'carrocería'
  else:
    for b, ws in BODY_SLUG.items():
      if b in ('st',) and base not in ('leon', 'ibiza'):
        continue
      if any(f'-{w}-' in joined for w in ws):
        return 'carrocería'
  for o in OTHER:
    if f'-{o}-' in joined and o not in ALLOWED.get(model, set()):
      return 'carrocería'
  return None

rows = json.load(open(ROWS))
src = open(EVID).read()
have = set(re.findall(r'-(\d{6,})\.htm', src))
reasons = collections.Counter()
keep, seen = [], set()
for r in rows:
  why = ok(r)
  aid = re.search(r'-(\d+)\.htm', r[9]).group(1)
  if not why and aid in have:
    why = 'ya estaba'
  key = (r[2], r[4], r[5], r[6], r[7])
  if not why and key in seen:
    why = 'repetido en otra sede'
  if why:
    reasons[why] += 1
    continue
  seen.add(key)
  keep.append(r)

# precios atípicos por grupo (gen + motor) y año
byg = collections.defaultdict(list)
for r in keep:
  byg[(r[2], r[4], r[5])].append(r[7])
byg2 = collections.defaultdict(list)
for r in keep:
  byg2[(r[2], r[4])].append(r[7])
clean = []
for r in keep:
  ps = byg[(r[2], r[4], r[5])]
  med = statistics.median(ps) if len(ps) >= 3 else statistics.median(byg2[(r[2], r[4])])
  if not (0.55 * med <= r[7] <= 1.7 * med):
    reasons['precio atípico'] += 1
    continue
  clean.append(r)

print('Entrada:', len(rows), '· válidos:', len(clean))
for k, v in reasons.most_common():
  print(f'  descartados por {k}: {v}')
cnt = collections.Counter((r[2], r[4]) for r in clean)
for (g, e), n in sorted(cnt.items(), key=lambda x: -x[1]):
  print(f'  {n:4d}  {g} · {e}')
json.dump(clean, open('data/milanuncios/clean.json', 'w'), ensure_ascii=False)
if '--import' in sys.argv:
  subprocess.run([sys.executable, 'scripts/tools/addrows.py', 'data/milanuncios/clean.json'], check=True)
