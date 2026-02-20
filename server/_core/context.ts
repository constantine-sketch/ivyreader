import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { auth } from "./better-auth";
import { syncBetterAuthUser } from "./auth-routes";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(opts: CreateExpressContextOptions): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    const session = await auth.api.getSession({
      headers: opts.req.headers as any,
    });

    if (session?.user) {
      user = await syncBetterAuthUser(
        session.user.id,
        session.user.email,
        session.user.name,
      );
    }
  } catch {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
