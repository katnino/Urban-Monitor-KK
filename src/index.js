const COLLECTION_KEY = 'banjaluka:points';

function json(body, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set('content-type', 'application/json; charset=utf-8');
  return new Response(JSON.stringify(body), { ...init, headers });
}

function unauthorized() {
  return json({ ok: false, error: 'Unauthorized' }, { status: 401 });
}

function checkAuth(request, env) {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  return token && token === env.ADMIN_PASSWORD;
}

async function readCollection(env) {
  const raw = await env.POINTS_KV.get(COLLECTION_KEY, { type: 'json' });
  if (raw && raw.type === 'FeatureCollection' && Array.isArray(raw.features)) {
    return raw;
  }
  return { type: 'FeatureCollection', features: [] };
}

async function writeCollection(env, collection) {
  await env.POINTS_KV.put(COLLECTION_KEY, JSON.stringify(collection));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Public: GET /api/points
    if (url.pathname === '/api/points' && request.method === 'GET') {
      const collection = await readCollection(env);
      return json(collection, { headers: { 'cache-control': 'no-store' } });
    }

    // Admin API (requires auth)
    if (url.pathname.startsWith('/api/admin')) {
      if (!checkAuth(request, env)) return unauthorized();

      // POST /api/admin/points — add
      if (url.pathname === '/api/admin/points' && request.method === 'POST') {
        const body = await request.json();
        const collection = await readCollection(env);
        const feature = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [Number(body.lng), Number(body.lat)]
          },
          properties: {
            id: body.id || `${body.type}-${Date.now()}`,
            type: body.type || 'bench',
            condition: body.condition || 'fair',
            material: body.material || '',
            has_backrest: body.has_backrest ?? true,
            bin_type: body.bin_type || '',
            has_lid: body.has_lid ?? false,
            notes: body.notes || '',
            date_surveyed: body.date_surveyed || new Date().toISOString().slice(0, 10),
            source: 'admin'
          }
        };
        collection.features.push(feature);
        await writeCollection(env, collection);
        return json({ ok: true, feature, total: collection.features.length });
      }

      // PUT /api/admin/points — update (id in body)
      if (url.pathname === '/api/admin/points' && request.method === 'PUT') {
        const body = await request.json();
        const collection = await readCollection(env);
        const idx = collection.features.findIndex(f => f.properties?.id === body.id);
        if (idx === -1) return json({ ok: false, error: 'Not found' }, { status: 404 });

        const old = collection.features[idx];
        collection.features[idx] = {
          ...old,
          geometry: {
            type: 'Point',
            coordinates: [
              Number(body.lng ?? old.geometry.coordinates[0]),
              Number(body.lat ?? old.geometry.coordinates[1])
            ]
          },
          properties: { ...old.properties, ...body, source: 'admin' }
        };
        await writeCollection(env, collection);
        return json({ ok: true, feature: collection.features[idx] });
      }

      // DELETE /api/admin/points?id=xxx — delete
      if (url.pathname === '/api/admin/points' && request.method === 'DELETE') {
        const id = url.searchParams.get('id');
        const collection = await readCollection(env);
        const before = collection.features.length;
        collection.features = collection.features.filter(f => f.properties?.id !== id);
        if (collection.features.length === before) {
          return json({ ok: false, error: 'Not found' }, { status: 404 });
        }
        await writeCollection(env, collection);
        return json({ ok: true, total: collection.features.length });
      }

      return json({ ok: false, error: 'Unknown route' }, { status: 404 });
    }

    // Everything else: static assets
    return env.ASSETS.fetch(request);
  }
};
