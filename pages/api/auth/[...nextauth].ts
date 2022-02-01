import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify'
import { LOGIN_URL } from '../../../lib/spotify';

export default NextAuth({
    // Configure one or more authenticaiton providers
    providers: [
        SpotifyProvider({
            // @ts-ignore
            clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
            // @ts-ignore
            clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
            authorization: LOGIN_URL
        }),
        // add more providers here
    ],
})