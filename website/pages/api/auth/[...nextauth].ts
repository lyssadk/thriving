import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { sql } from '@vercel/postgres';

export const authOptions = {
  debug: true,
  secret: process.env.NEXTAUTH_SECRET as string,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid profile email https://www.googleapis.com/auth/gmail.readonly", // Add the Gmail API scope
        },
      },
    }),
  ],

  callbacks: {
    async session({ session, token, user }) {
      session.user.id = token.id;
      session.accessToken = token.accessToken;
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
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
