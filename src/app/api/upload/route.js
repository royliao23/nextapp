import { parse } from 'csv-parse/sync';
import clientPromise from '@/app/lib/mongodb';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    const fileContent = await file.text();
    const client = await clientPromise;
    const db = client.db();
    const fixturesCollection = db.collection('fixtures');

    // Parse CSV
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    // Transform data to match your CSV structure
    const fixtures = records.map(record => ({
      fixtureId: record.fixture_mid,
      season: record.season,
      competition: record.competition_name,
      date: new Date(record.fixture_datetime),
      round: record.fixture_round,
      homeTeam: record.home_team,
      awayTeam: record.away_team,
      createdAt: new Date()
    }));

    // Insert into MongoDB
    const result = await fixturesCollection.insertMany(fixtures);

    return Response.json({ 
      message: 'File uploaded successfully',
      insertedCount: result.insertedCount,
      fixtures: fixtures.slice(0, 5) // Return first 5 for preview
    });
  } catch (error) {
    console.error('Error processing file:', error);
    return Response.json({ 
      error: error.message,
      details: 'Check your CSV format and database connection'
    }, { status: 500 });
  }
}