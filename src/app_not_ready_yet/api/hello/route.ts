import { NextResponse } from 'next/server';

export async function GET(request: Request, res: Response): Promise<NextResponse> {
  return NextResponse.json({ name: 'John' });
}
