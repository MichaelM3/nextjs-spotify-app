import { JWT } from 'next-auth/jwt';
import NextAuth from 'next-auth';

declare module 'next-auth' {
	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		user: {
			/** The user's access token */
			accessToken: string;
			refreshToken: string;
			username: string;
		};
	}

	interface Account {
		expires_at: number;
	}
}

declare module 'next-auth/jwt' {
	/** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
	interface JWT {
		/** OpenID ID Token */
		accessTokenExpires: number;
	}
}
