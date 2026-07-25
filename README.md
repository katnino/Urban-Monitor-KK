# URBAN MONITOR Klupe i korpe

3D mapa Banje Luke sa klupama, korpama za otpatke i
prikazom važnih gradskih tačaka.

Cilj je jednostavan: da građani vide koja urbana oprema postoji i u kakvom je
zaista stanju.

**Mapa:** otvorite `index.html` lokalno ili objavite projekat na statičkom hostingu
(Cloudflare Pages, GitHub Pages, i sl.).

## Šta je mapirano

- 🪑 Klupe - materijal, naslon, stanje
- 🗑️ Korpe za otpatke - tip (obična/za reciklažu), poklopac, stanje
- 💡 Javna rasvjeta - planirano

Svaka stavka je ocenjena kao **dobro / zadovoljavajuće / loše** na osnovu
vizuelnog pregleda.

## Format podataka

Podaci se nalaze u `points.geojson`, standardnoj GeoJSON FeatureCollection.
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

- Običan HTML + [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/) - bez build koraka
- 3D prikaz koristi OpenFreeMap stil i 3D ekstrudirane zgrade
- Podaci su u `points.geojson` (standardna GeoJSON FeatureCollection)

## Plan

- [ ] Potpuno pokrivanje centra grada i parkova klupama i korpama
- [ ] Javna rasveta
- [ ] Prijave stanja od građana
