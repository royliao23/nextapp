import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        const res = await fetch('http://localhost:4000/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: credentials.username,
            password: credentials.password
          })
        });

        const data = await res.json();

        if (res.ok && data.token) {
          return {
            id: data.userId,
            name: data.username,
            token: data.token,
          };
        }

        throw new Error(data.message || 'Invalid credentials');
      }
    })
  ],
  pages: {
    signIn: '/login', // your custom login page
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.token) {
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    }
  }
});
