import bcrypt from "bcrypt";
import { ZodError } from "zod";
import NextAuth from "next-auth";
import prisma from "@/lib/prisma";
import { v4 as uuid } from "uuid";
import { authSchema } from "@/lib/zod";
import { encode } from "next-auth/jwt";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";

const adapter = PrismaAdapter(prisma);

// Constant for session expiry time (30 days)
const SESSION_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

// Helper function to create a session and return the session token
const createSession = async (userId: string) => {
  const sessionToken = uuid();
  const createdSession = await adapter?.createSession?.({
    sessionToken,
    userId,
    expires: new Date(Date.now() + SESSION_EXPIRY_MS),
  });

  if (!createdSession) {
    throw new Error("Failed to create session");
  }

  return sessionToken;
};

// NextAuth configuration
export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter,
  providers: [
    GitHub,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          // Parse credentials using authSchema for validation
          const { email, password } = await authSchema.parseAsync(credentials);

          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email },
          });

          // Check if the user exists and validate password
          if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
            throw new Error("Invalid credentials.");
          }

          // Return the user object if credentials are valid
          return user;
        } catch (error) {
          if (error instanceof ZodError) {
            // Return null if validation fails
            return null;
          }
          console.error(error); // Log other errors for debugging
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true; // Add flag to token for credentials provider
      }
      return token;
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        if (!params.token?.sub) {
          throw new Error("No user ID found in token");
        }
        return await createSession(params.token.sub); // Create session for the user and return session token
      }
      return encode(params); // Default encoding for JWT
    },
  },
});
