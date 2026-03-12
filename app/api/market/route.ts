import { NextResponse } from 'next/server';

const API_KEY = process.env.POLYGON_API_KEY;
const BASE_URL = 'https://api.polygon.io';

// Simple delay function
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Cache to avoid hitting rate limits
const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 60000; // 1 minute

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');

  if (!endpoint) {
    return NextResponse.json({ error: 'No endpoint provided' }, { status: 400 });
  }

  // Return cached data if fresh
  const cached = cache[endpoint];
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return NextResponse.json(cached.data);
  }

  try {
    await delay(200); // Small delay to avoid rate limits
    const response = await fetch(`${BASE_URL}${endpoint}?apiKey=${API_KEY}`);
    const data = await response.json();

    // Save to cache
    cache[endpoint] = { data, timestamp: Date.now() };

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 });
  }
}
