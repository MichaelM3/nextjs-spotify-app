import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
import SpotifyProvider from 'next-auth/providers/spotify';
import spotifyApi, { LOGIN_URL } from '../../../lib/spotify';

async function refreshAccessToken(token: JWT) {
	try {
		spotifyApi.setAccessToken(<string>token.accessToken);
		spotifyApi.setRefreshToken(<string>token.refreshToken);

		const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
		console.log('REFRESHED TOKEN IS', refreshedToken);
		return {
			...token,
			accessToken: refreshedToken.access_token,
			accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
			refreshToken: refreshedToken.refresh_token ?? token.refreshedToken,
			// Replace if new one came back else fall back to old refresh token
		};
	} catch (err) {
		console.error(err);
		return { ...token, error: 'RefreshAccessTokenError' };
	}
}

export default NextAuth({
	// Configure one or more authenticaiton providers
	providers: [
		SpotifyProvider({
			// @ts-ignore
			clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
			// @ts-ignore
			clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
			authorization: LOGIN_URL,
		}),
		// add more providers here
	],
	secret: process.env.JWT_SECRET,
	pages: {
		signIn: '/login',
	},
	callbacks: {
		async jwt({ token, account, user }) {
			// initial sign in
			if (account && user) {
				return {
					...token,
					accessToken: account.access_token,
					refreshToken: account.refresh_token,
					username: account.providerAccountId,
					accessTokenExpires: account.expires_at * 1000,
				};
			}

			// Return Previous token if the access token has not expirted yet
			if (Date.now() < token.accessTokenExpires) {
				console.log('EXISTING TOKEN IS VALID');
				return token;
			}
			// Access token has expired, so we need to refresh it...
			console.log('ACCESS TOKEN HAS EXPIRED, REFRESHING...');
			return await refreshAccessToken(token);
		},

		async session({ session, token }) {
			session.user.accessToken = <string>token.accessToken;
			session.user.refreshToken = <string>token.refreshToken;
			session.user.username = <string>token.username;

			return session;
		},
	},
});
