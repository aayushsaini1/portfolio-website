import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const KNOWN_BOTS = [
  'python-requests',
  'python',
  'curl',
  'wget',
  'go-http-client',
  'scrapy',
  'axios',
  'postmanruntime',
  'httpx',
  'aiohttp',
  'java/',
  'libwww-perl',
  'urllib',
  'puppeteer',
  'playwright',
  'selenium',
  'headlesschrome',
];

export async function GET(request) {
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
  const referer = request.headers.get('referer') || '';
  const host = request.headers.get('host') || '';

  // 1. Reject automated scraper & crawler User-Agents
  const isBot = KNOWN_BOTS.some((bot) => userAgent.includes(bot));
  if (isBot) {
    return new NextResponse('Access Denied', { status: 403 });
  }

  // 2. Verify Referer matches domain in production
  if (process.env.NODE_ENV === 'production' && referer) {
    try {
      const refererHost = new URL(referer).host;
      if (refererHost !== host) {
        return new NextResponse('Forbidden', { status: 403 });
      }
    } catch {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  // 3. Read PDF from secure server-only content directory
  const filePath = path.join(process.cwd(), 'content', 'secure', 'aayush-saini-resume.pdf');

  if (!fs.existsSync(filePath)) {
    return new NextResponse('File Not Found', { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);

  // 4. Return protected response with anti-scraping and indexing control headers
  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="Aayush_Saini_Resume.pdf"',
      'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
