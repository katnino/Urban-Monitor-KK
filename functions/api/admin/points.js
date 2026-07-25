const COLLECTION_KEY = 'banjaluka:points';

function checkAuth(context) {
  const auth = context.request.headers.get('Authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  return token && token === context.env.ADMIN_PASSWORD;
}

async function readCollection(env) {
  const store = env.POINTS_KV;
  if (!store) return { type: 'FeatureCollection', features: [] };
  const raw = await store.get(COLLECTION_KEY, { type: 'json' });
  if (raw && raw.type === 'FeatureCollection' && Array.isArray(raw.features)) return raw;
  return { type: 'FeatureCollection', features: [] };
}

async function writeCollection(env, collection) {
  const store = env.POINTS_KV;
  if (store) await store.put(COLLECTION_KEY, JSON.stringify(collection));
}

function json(body, status = 200) {
  return Response.json(body, {
    status,
    headers: { 'cache-control': 'no-store' }
  });
}

// GET — list all
export async function onRequestGet(context) {
  if (!checkAuth(context)) return json({ ok: false, error: 'Unauthorized' }, 401);
  const collection = await readCollection(context.env);
  return json(collection);
}

// POST — add new
export async function onRequestPost(context) {
  if (!checkAuth(context)) return json({ ok: false, error: 'Unauthorized' }, 401);

  const body = await context.request.json();
  const collection = await readCollection(context.env);

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
  await writeCollection(context.env, collection);
  return json({ ok: true, feature, total: collection.features.length });
}

// PUT — update (id in body)
export async function onRequestPut(context) {
  if (!checkAuth(context)) return json({ ok: false, error: 'Unauthorized' }, 401);

  const body = await context.request.json();
  const collection = await readCollection(context.env);
  const idx = collection.features.findIndex(f => f.properties?.id === body.id);

  if (idx === -1) return json({ ok: false, error: 'Not found' }, 404);

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

  await writeCollection(context.env, collection);
  return json({ ok: true, feature: collection.features[idx] });
}

// DELETE — remove by id
export async function onRequestDelete(context) {
  if (!checkAuth(context)) return json({ ok: false, error: 'Unauthorized' }, 401);

  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');
  const collection = await readCollection(context.env);
  const before = collection.features.length;
  collection.features = collection.features.filter(f => f.properties?.id !== id);

  if (collection.features.length === before) {
    return json({ ok: false, error: 'Not found' }, 404);
  }

  await writeCollection(context.env, collection);
  return json({ ok: true, total: collection.features.length });
}
