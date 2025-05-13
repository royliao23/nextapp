import clientPromise from '@/app/lib/mongodb';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return Response.json({ error: 'Search query is required' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const fixturesCollection = db.collection('fixtures');

    const results = await fixturesCollection.find({
      $or: [
        { homeTeam: { $regex: q, $options: 'i' } },
        { awayTeam: { $regex: q, $options: 'i' } },
      ],
    }).sort({ date: -1 }).limit(50).toArray();

    return Response.json(results);
  } catch (error) {
    console.error('Error searching:', error);
    return Response.json({ error: 'Error searching fixtures' }, { status: 500 });
  }
}