// src/lib/auth.ts
import type { Adapter } from "next-auth/adapters";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";
import { Resend } from "resend";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    verifyRequest: "/auth/verify-request",
  },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials.password) return null;
        const user = await prisma.user.findUnique({ where: { username: credentials.username } });
        if (!user || !user.password) return null;
        if (!user.emailVerified) throw new Error("Email not verified.");
        const isValid = await bcrypt.compare(credentials.password, user.password);
        return isValid ? user : null;
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      async sendVerificationRequest({ identifier: email, url }) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.EMAIL_FROM!,
          to: email,
          subject: "Sign in to laghuUrl",
          text: `Sign in to laghuUrl by clicking this link: ${url}`,
        });
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user ,trigger, session}) {
      if (user) {
        token.id = user.id;
        token.username = user.username; 
      }
      if(trigger === 'update' && session?.name){
        const dbUser = await prisma.user.findUnique({
        where: { id: token.id as string },
      });
      if (dbUser) {
        token.name = dbUser.name;
        token.username = dbUser.username;
      }
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.username = token.username as string | null;
      session.user.name = token.name
      return session;
    },
  },
};