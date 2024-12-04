import { NextRequest, NextResponse } from 'next/server';


export function middleware(req: NextRequest) {
  if (req.method === 'OPTIONS') {
    return NextResponse.json({ status: 200 });
  }

  const apiKeyHeader = req.headers.get('x-api-key');
  const apiKeyQuery = req.nextUrl.searchParams.get('apiKey');
  const apiKey = apiKeyHeader || apiKeyQuery;

  console.log('API Key ricevuta:', apiKey); // Per debugging
  console.log('API Key attesa:', process.env.API_KEY); // Verifica

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return NextResponse.json(
      { error: "Non autorizzato: API Key non valida" },
      { status: 401 }
    );
  }

  return NextResponse.next();
}