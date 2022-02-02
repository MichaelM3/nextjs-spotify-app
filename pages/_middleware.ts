import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req: any) {
	const url = req.nextUrl.clone();
	// Token will exist if user is logged in
	const token = await getToken({
		req,
		secret: <string>process.env.JWT_SECRET,
	});

	const { pathname } = url;

	// Allow the requests if the following is true...
	// 1) It's a request for next-auth session & provider fetching
	// 2) the token exists
	if (pathname.includes('/api/auth') || token) {
		return NextResponse.next();
	}

	// Redirect them to login if they dont have token AND
	// are requesting a protected route
	if (!token && pathname !== '/login') {
		url.pathname = '/login';
		return NextResponse.rewrite(url);
	}
}
