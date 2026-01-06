import { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
// import FacebookProvider from "next-auth/providers/facebook"; // Optional: Add Facebook OAuth later
import prisma from "@/lib/db/prisma";
import { verifyPassword } from "./password";

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),
    // Optional: Add Facebook OAuth later if needed
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_CLIENT_ID!,
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    //   authorization: {
    //     params: {
    //       scope: "email public_profile",
    //     },
    //   },
    // }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await verifyPassword(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // After sign-in, redirect to account page
      // If the url is the sign-in page or base url, go to account
      if (url === baseUrl || url.includes("/auth/signin")) {
        return `${baseUrl}/account`;
      }
      // Allow callbacks to same origin
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // Default to account page
      return `${baseUrl}/account`;
    },
    async signIn({ user, account, profile }) {
      // OAuth providers automatically create user via Prisma adapter
      if (account?.type === "oauth") {
        // Email verification automatic for OAuth users
        if (user.email && !user.emailVerified) {
          await prisma.user.update({
            where: { email: user.email },
            data: { emailVerified: new Date() },
          });
        }
      }
      return true;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
      }
      // Include OAuth provider info in JWT
      if (account && profile) {
        token.provider = account.provider;
        token.picture = profile.image || (profile as any).picture;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        // Pass provider and profile image to client session
        if (token.provider) {
          (session.user as any).provider = token.provider;
        }
        if (token.picture) {
          session.user.image = token.picture as string;
        }
      }
      return session;
    },
  },
};
