import "server-only";

import NextAuth from "next-auth";
import prisma from "@/lib/prisma";
import { logger } from "@/lib/logger";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import { PrismaAdapter } from "@auth/prisma-adapter";

const log = logger.child({ module: "auth" });

const adapter = PrismaAdapter(prisma);

const providers: Provider[] = [
  GitHub({ allowDangerousEmailAccountLinking: true }),
  Google({ allowDangerousEmailAccountLinking: true }),
];

export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  }
  return { id: provider.id, name: provider.name };
});

// NextAuth configuration
export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter,
  providers,
  pages: {
    signIn: "/sign-in",
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
            "User created and assigned ADMIN role",
          );
        } else {
          log.info(
            { userId: user.id, durationMs: Date.now() - startTime },
            "User created successfully",
          );
        }
      } catch (error) {
        log.error(
          { userId: user.id, durationMs: Date.now() - startTime, error },
          "Failed to create user or assign role",
        );
        throw error;
      }
    },

    async linkAccount({ user, account, profile }) {
      const startTime = Date.now();
      log.debug(
        { userId: user.id, provider: account.provider },
        "Linking new provider account to existing user",
      );

      try {
        log.info(
          {
            userId: user.id,
            provider: account.provider,
            email: profile.email,
            durationMs: Date.now() - startTime,
          },
          "Successfully linked provider account",
        );
      } catch (error) {
        log.error(
          {
            userId: user.id,
            provider: account.provider,
            durationMs: Date.now() - startTime,
            error,
          },
          "Failed to link provider account",
        );
        throw error;
      }
    },

    async signIn({ user, account, profile, isNewUser }) {
      const startTime = Date.now();
      log.debug(
        { userId: user.id, provider: account?.provider },
        "User attempting to sign in",
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
          "User signed in successfully",
        );
      } catch (error) {
        log.error(
          {
            userId: user.id,
            provider: account?.provider,
            durationMs: Date.now() - startTime,
            error,
          },
          "Failed to sign in",
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
            "User signed out successfully (database session)",
          );
        } else if ("token" in message) {
          log.info(
            {
              token: message.token,
              durationMs: Date.now() - startTime,
            },
            "User signed out successfully (JWT session)",
          );
        }
      } catch (error) {
        log.error(
          {
            durationMs: Date.now() - startTime,
            error,
          },
          "Failed to sign out",
        );
        throw error;
      }
    },
  },
});
