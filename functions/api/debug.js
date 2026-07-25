export async function onRequestGet(context) {
  const pw = context.env.ADMIN_PASSWORD;
  return Response.json({
    hasPassword: !!pw,
    length: pw ? pw.length : 0
  });
}
