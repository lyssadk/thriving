import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import vercelPostgresAdapter from "../../../lib/vercelPostgresAdapter";
import { sql } from '@vercel/postgres';

export const authOptions = {
  debug: true,
  secret: process.env.NEXTAUTH_SECRET as string,
  adapter: vercelPostgresAdapter(),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
     },
    }),
    
  ],
  callbacks: {
    async session({ session, token }) {
      // Attach user ID to session object
      session.user.id = token.id;
      return session;
    },
    async jwt({ token, account, user }) {
      if (account && user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin', // Custom sign-in page
    error: '/auth/error', // Custom error page
  },
  events: {
    async signIn(message) {
      // Check if user exists in the database, if not, create them
      const user = await getUserByEmail(message.user.email);

      if (!user) {
        await createUser(message.user);
      }
    },
  },
};

// Fetch user by email from PostgreSQL
async function getUserByEmail(email) {
  const res = await sql`
    SELECT * FROM users WHERE email = ${email}
  `;

  return res.rows[0];
}

// Create a new user in the PostgreSQL database
async function createUser(user) {
  const { name, email, image } = user;
  const res = await sql`
    INSERT INTO users (name, email, image) 
    VALUES (${name}, ${email}, ${image}) RETURNING id
  `
  return res.rows[0];
}
  




export default NextAuth(authOptions);