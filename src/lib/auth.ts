import "server-only";

import bcrypt from "bcryptjs";
import { ZodError } from "zod";
import NextAuth from "next-auth";
import prisma from "@/lib/prisma";
import { v4 as uuid } from "uuid";
import { logger } from "@/lib/logger";
import { authSchema } from "@/lib/zod";
import { encode } from "next-auth/jwt";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";

const log = logger.child({ module: "auth" });

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

const providers: Provider[] = [
  GitHub({ allowDangerousEmailAccountLinking: true }),
  Google({ allowDangerousEmailAccountLinking: true }),
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
        if (
          !user ||
          !user.password ||
          !(await bcrypt.compare(password, user.password))
        ) {
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
];

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== "credentials");

// NextAuth configuration
export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter,
  providers,
  pages: {
    signIn: "/sign-in",
  },
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
  events: {
    async createUser({ user }) {
      const startTime = Date.now();
      log.debug({ user }, "Creating new user");

      try {
        const count = await prisma.user.count();
        log.debug({ count }, "Total user count");

        if (count === 1) {
          log.debug("First user detected, assigning ADMIN role");
          await prisma.user.update({
            where: { id: user.id },
            data: { role: "ADMIN" },
          });
          log.info(
            { userId: user.id, durationMs: Date.now() - startTime },
            "User created and assigned ADMIN role"
          );
        } else {
          log.info(
            { userId: user.id, durationMs: Date.now() - startTime },
            "User created successfully"
          );
        }
      } catch (error) {
        log.error(
          { userId: user.id, durationMs: Date.now() - startTime, error },
          "Failed to create user or assign role"
        );
        throw error;
      }
    },

    async linkAccount({ user, account, profile }) {
      const startTime = Date.now();
      log.debug(
        { userId: user.id, provider: account.provider },
        "Linking new provider account to existing user"
      );

      try {
        log.info(
          {
            userId: user.id,
            provider: account.provider,
            email: profile.email,
            durationMs: Date.now() - startTime,
          },
          "Successfully linked provider account"
        );
      } catch (error) {
        log.error(
          {
            userId: user.id,
            provider: account.provider,
            durationMs: Date.now() - startTime,
            error,
          },
          "Failed to link provider account"
        );
        throw error;
      }
    },

    async signIn({ user, account, profile, isNewUser }) {
      const startTime = Date.now();
      log.debug(
        { userId: user.id, provider: account?.provider },
        "User attempting to sign in"
      );

      try {
        log.info(
          {
            userId: user.id,
            provider: account?.provider,
            email: profile?.email,
            isNewUser,
            durationMs: Date.now() - startTime,
          },
          "User signed in successfully"
        );
      } catch (error) {
        log.error(
          {
            userId: user.id,
            provider: account?.provider,
            durationMs: Date.now() - startTime,
            error,
          },
          "Failed to sign in"
        );
        throw error;
      }
    },

    async signOut(message) {
      const startTime = Date.now();

      try {
        if ("session" in message) {
          log.info(
            {
              sessionId: message.session?.sessionToken,
              userId: message.session?.userId,
              durationMs: Date.now() - startTime,
            },
            "User signed out successfully (database session)"
          );
        } else if ("token" in message) {
          log.info(
            {
              token: message.token,
              durationMs: Date.now() - startTime,
            },
            "User signed out successfully (JWT session)"
          );
        }
      } catch (error) {
        log.error(
          {
            durationMs: Date.now() - startTime,
            error,
          },
          "Failed to sign out"
        );
        throw error;
      }
    },
  },
});
