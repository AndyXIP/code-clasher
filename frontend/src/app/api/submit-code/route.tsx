import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body from the incoming request
    const payload = await request.json();

    const response = await fetch('https://main-api.click/api/submit-code', {
      method: 'POST',  // Change to POST request
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),  // Send the payload in the body
    });

    if (!response.ok) {
      // Handle error from the API
      return NextResponse.json({ error: 'Failed to submit code' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Error submitting code:', error);  // Log the error for debugging
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
