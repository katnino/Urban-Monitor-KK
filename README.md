# URBAN MONITOR©️ Klupe i korpe

3D mapa grada Banjaluke sa klupama, korpama za otpatke i
prikazom važnijih gradskih tačaka.

Cilj je jednostavan: da građani vide koja urbana oprema postoji i u kakvom je
zaista stanju.

## Šta je mapirano

- 🪑 Klupe - materijal, naslon, stanje
- 🗑️ Korpe za otpatke - tip (obična/za reciklažu), poklopac, stanje
- 💡 Javna rasvjeta - planirano

Svaka stavka je ocjenjena kao **dobro / zadovoljavajuće / loše** na osnovu
vizuelnog pregleda.

## Format podataka

Primarni podaci se čuvaju u Cloudflare KV bazi pod ključem `banjaluka:points`
i izlažu kroz `/api/points`. Ako KV nije dostupan, aplikacija pada nazad na
lokalni `points.geojson` koji je ujedno bekap podataka.
Jedna tačka izgleda ovako:

```json
{
  "type": "Feature",
  "geometry": { "type": "Point", "coordinates": [17.1910, 44.7725] },
  "properties": {
    "id": "bench-0001",
    "type": "bench",
    "condition": "fair",
    "material": "wood",
    "has_backrest": true,
    "notes": "Nedostaje jedna daska, noga je klimava",
    "date_surveyed": "2026-07-20"
  }
}
```

Korpe koriste `bin_type` i `has_lid` umesto `material` i `has_backrest`.

## Tehnologija

- HTML + [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/) - bez build koraka
- 3D prikaz koristi OpenFreeMap stil i 3D ekstrudirane zgrade
- Podaci se čitaju iz `/api/points`, a lokalni `points.geojson` služi kao fallback


## Doprinos

Vidite klupu ili korpu koja nedostaje, pomjerena je ili joj se stanje promjenilo?
Otvorite issue.

## Plan

- [ ] Potpuno pokrivanje užeg i šireg centra grada i parkova klupama i korpama
- [ ] Javna rasvjeta
- [ ] Prijave stanja od građana

## Licenca

Ovaj repo je javno vidljiv u demonstracijske svrhe. Kod nije otvorenog tipa (open-source) i sva prava su zadržana. Za institucionalnu upotrebu (obrazovne ustanove, Ministarstvo obrazovanja, jedinice lokalnih opština) ili partnerstva, kontakt: noniboy@zoho.com
