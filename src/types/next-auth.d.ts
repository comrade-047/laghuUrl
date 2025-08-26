// src/types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username : string | null;
    } & DefaultSession["user"]; 
  }
  interface User {
    username : string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username : string | null;
  }
}