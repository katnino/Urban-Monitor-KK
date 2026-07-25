# URBAN MONITOR Klupe i korpe

3D mapa grada Banjaluke sa klupama, korpama za otpatke i
prikazom važnih gradskih tačaka.

Cilj je jednostavan: da građani vide koja urbana oprema postoji i u kakvom je
zaista stanju.

## Šta je mapirano

- 🪑 Klupe - materijal, naslon, stanje
- 🗑️ Korpe za otpatke - tip (obična/za reciklažu), poklopac, stanje
- 💡 Javna rasvjeta - planirano

Svaka stavka je ocenjena kao **dobro / zadovoljavajuće / loše** na osnovu
vizuelnog pregleda.

## Format podataka

Primarni podaci se čuvaju u Cloudflare KV bazi pod ključem `banjaluka:points`
i izlažu kroz `/api/points`. Ako KV nije dostupan, aplikacija pada nazad na
lokalni `points.geojson`.

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

## Kako dodati ili izmeniti stavku

Admin panel dostupan na `/admin` (potrebna Cloudflare KV + varijabla `ADMIN_PASSWORD`).

1. Prijavite se na `/admin` sa lozinkom
2. Dodajte, izmenite ili obrišite stavku
3. Promene su vidljive na mapi odmah

Alternativno: uredite `points.geojson` direktno ako želite da promenite
početni fallback sadržaj.

## Doprinos

Vidite klupu ili korpu koja nedostaje, pomerena je ili joj se stanje promenilo?
Otvorite issue ili dodajte izmene kroz admin panel.

## Plan

- [ ] Potpuno pokrivanje centra grada i parkova klupama i korpama
- [ ] Javna rasveta
- [ ] Prijave stanja od građana
