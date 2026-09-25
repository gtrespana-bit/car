#!/usr/bin/env python3
"""Añade anuncios a marketEvidence.js. Uso: addrows.py filas.json
Cada fila: [brand, model, gen, market, engine, year, km, price, source, url]"""
import json, sys
P = 'src/data/catalog/marketEvidence.js'
rows = json.load(open(sys.argv[1]))
q = lambda s: "'" + str(s).replace("\\", "\\\\").replace("'", "\\'") + "'"
lines = ''.join(
  f"  {{ brand: {q(b)}, model: {q(m)}, gen: {q(g)}, market: {q(mk)}, kind: 'anuncio', engine: {q(e)}, year: {int(y)}, km: {int(k)}, price: {int(p)}, source: {q(s)}, url: {q(u)} }},\n"
  for b, m, g, mk, e, y, k, p, s, u in rows)
src = open(P).read()
assert src.count('\n];') == 1
open(P, 'w').write(src.replace('\n];', '\n' + lines.rstrip('\n') + '\n];', 1))
print(len(rows), 'filas')
