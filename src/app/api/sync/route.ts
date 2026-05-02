import { NextResponse } from 'next/server';
import { syncGoogleServicesToFirebase } from '@/lib/syncServices';

export async function POST() {
  const result = await syncGoogleServicesToFirebase();
  
  if (result.success) {
    return NextResponse.json(result, { status: 200 });
  } else {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
}
