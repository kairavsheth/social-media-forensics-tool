// app/api/proxy-image/route.ts (Next.js 13+ with app directory)
import {NextRequest, NextResponse} from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get('url');
    if (!imageUrl) {
        return new NextResponse('Missing url parameter', { status: 400 });
    }

    console.log(imageUrl);

    const response = await fetch(imageUrl);

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const imageBuffer = await response.arrayBuffer();

    // log the base64 string of the image

    const base64String = Buffer.from(imageBuffer).toString('base64');
    console.log(base64String);

    return new NextResponse(imageBuffer, {
        status: 200,
        headers: {
            'Content-Type': contentType,
            'Access-Control-Allow-Origin': '*', // Allow all origins
        },
    });
}
