import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Enable CORS for all routes - reflect the request origin to support credentials
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    );
    res.header("Access-Control-Allow-Credentials", "true");

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // Stripe webhook needs raw body for signature verification
  app.post("/api/webhooks/stripe", 
    express.raw({ type: "application/json" }), 
    async (req, res) => {
      const { handleStripeWebhook } = await import("../webhooks/stripe.js");
      return handleStripeWebhook(req, res);
    }
  );
  
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  registerOAuthRoutes(app);

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, timestamp: Date.now() });
  });

  // REST endpoint for subscription creation (used by checkout page)
  app.post("/api/subscriptions/create", async (req, res) => {
    try {
      const { paymentMethodId, email, tier } = req.body;
      const { getUserByEmail, upsertUser, updateUserSubscription } = await import("../db.js");
      
      // Check if user exists
      let user = await getUserByEmail(email);
      
      // Create pending user if doesn't exist
      if (!user) {
        const tempOpenId = `pending_${Buffer.from(email).toString('base64').replace(/=/g, '').substring(0, 50)}`;
        await upsertUser({
          openId: tempOpenId,
          email,
          name: email.split('@')[0],
          subscriptionTier: tier,
          emailVerified: 0,
          onboardingCompleted: 0
        });
        user = await getUserByEmail(email);
        if (!user) throw new Error('Failed to create user');
      }
      
      // Create Stripe subscription
      const { createSubscription } = await import('../lib/stripe.js');
      const result = await createSubscription({ paymentMethodId, email, tier, userId: user.id });
      
      // Update user subscription
      const status = result.status === 'active' || result.status === 'trialing' ? result.status : 'active';
      await updateUserSubscription(user.id, {
        stripeCustomerId: result.customerId,
        stripeSubscriptionId: result.subscriptionId,
        subscriptionStatus: status,
        subscriptionTier: tier
      });
      
      res.json({ success: true, subscriptionId: result.subscriptionId, userId: user.id });
    } catch (error: any) {
      console.error('[Subscription] Error:', error);
      res.status(500).json({ error: error.message || 'Subscription creation failed' });
    }
  });

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`[api] server listening on port ${port}`);
  });
}

startServer().catch(console.error);
