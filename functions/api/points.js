export async function onRequestGet(context) {
  const store = context.env.POINTS_KV;
  if (!store) {
    return Response.json({ type: 'FeatureCollection', features: [] });
  }

  const raw = await store.get('banjaluka:points', { type: 'json' });
  const collection = raw && raw.type === 'FeatureCollection' ? raw : { type: 'FeatureCollection', features: [] };

  return Response.json(collection, {
    headers: { 'cache-control': 'no-store' }
  });
}
