import { fetchCompany, updateCompany } from "@/app/lib/api";
export async function GET(request) {
  try {
    const data = await fetchCompany(request);
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return Response.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const data = await updateCompany(body);
    return Response.json(data);
  } catch (error) {
    console.error('Error updating company:', error);
    return Response.json({ error: 'Failed to update company' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const res = await fetch('https://royliao.pythonanywhere.com/high/company/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${request.headers.get('authorization')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      throw new Error(`Django error: ${res.status}`);
    }

    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error creating company:', error);
    return Response.json({ error: 'Failed to create company' }, { status: 500 });
  }
}
