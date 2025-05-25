let favoriteShows = {};

export async function GET() {
  return Response.json(Object.values(favoriteShows));
}

export async function POST(request) {
  const body = await request.json();
  if (!body || !body.id || !body.name) {
    return Response.json({ error: "Invalid show data" }, { status: 400 });
  }
  favoriteShows[body.id] = body;
  return Response.json({ ok: true });
}

export async function DELETE(request) {
  const { id } = await request.json();
  if (!id) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }
  delete favoriteShows[id];
  return Response.json({ ok: true });
}
