import { NextResponse } from 'next/server';

const API_KEY = process.env.POLYGON_API_KEY;
const BASE_URL = 'https://api.polygon.io';

const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 300000; // 5 minutes cache

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
    const response = await fetch(`${BASE_URL}${endpoint}?apiKey=${API_KEY}`);
    const data = await response.json();
    cache[endpoint] = { data, timestamp: Date.now() };
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
