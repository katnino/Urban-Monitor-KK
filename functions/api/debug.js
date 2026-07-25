export async function onRequestGet(context) {
  const pw = context.env.ADMIN_PASSWORD;
  const auth = context.request.headers.get('Authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  return Response.json({
    hasPassword: !!pw,
    passwordLength: pw ? pw.length : 0,
    authHeader: auth || '(none)',
    extractedToken: token || '(none)',
    match: token === pw
  });
}
