import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req });
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

 
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/product-page/:path*', 
    '/email/:path*', 
    '/update-receipt/:path*', 
    '/update-receipt/[id]', 
    '/add-company/:path*', 
    '/api/transactions/:path*', 
    '/api/Receipts/:path*', 
    '/api/scrapeEmail', 
    '/api/dashboard/:path*', 
    '/api/sales/:path*',
    '/api/Products/:path*',
    '/api/companies/:path*',
    '/inventory/:path*',
    '/product-page/add-product/:path*',
    '/add-company/:path*',
    '/company/:path*',
    '/company/company-links/:path*',
    '/api/shipping/:path*',
  ]
}

