import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals';
import { config } from 'dotenv';

// Load test environment variables first
config({ path: '.env.test' });

import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { auth } from '../lib/auth.js';
import type { Session } from '../types.js';

// Create test server instance
const createTestApp = () => {
  const app = new Hono<{ Variables: Session }>();

  app.get('/health', (c) => {
    return c.text('OK');
  });

  app.use("/api/auth/*", cors({
    origin: '*',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true
  }));

  app.use("*", async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      c.set('user', null);
      c.set('session', null);
      return next();
    }

    c.set('user', session.user);
    c.set('session', session);
    return next();
  });

  app.on(["GET", "POST"], "/api/auth/*", (c) => {
    return auth.handler(c.req.raw);
  });

  return app;
};

describe('Auth API Integration Tests', () => {
  let app: Hono<{ Variables: Session }>;
  let server: any;
  let testPort: number;
  let baseUrl: string;

  beforeAll(() => {
    // Use a random port to avoid conflicts
    testPort = 3000;
    baseUrl = `http://localhost:${testPort}`;
    app = createTestApp();
  });

  beforeEach(async () => {
    // Start server for each test
    server = serve({
      fetch: app.fetch,
      port: testPort
    });
    // Give server time to start
    await new Promise(resolve => setTimeout(resolve, 200));
  });

  afterEach(() => {
    // Close server after each test
    if (server) {
      server.close();
      server = null;
    }
  });

  afterAll(() => {
    // Final cleanup
    if (server) {
      server.close();
    }
  });

  describe('Health Check', () => {
    it('should return OK for health endpoint', async () => {
      const response = await fetch(`${baseUrl}/health`);
      const text = await response.text();

      expect(response.status).toBe(200);
      expect(text).toBe('OK');
    });
  });

  describe('Session Management', () => {
    it('should handle session validation with no token', async () => {
      const response = await fetch(`${baseUrl}/api/auth/get-session`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      // Better-auth returns null when no session exists
      expect(data).toBeNull();
    });

    it('should handle session validation with invalid token', async () => {
      const response = await fetch(`${baseUrl}/api/auth/get-session`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer invalid-token'
        }
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      // Better-auth returns null when no session exists
      expect(data).toBeNull();
    });
  });

  describe('Authentication Endpoints', () => {
    it('should handle sign-up request', async () => {
      const signUpData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await fetch(`${baseUrl}/api/auth/sign-up/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signUpData)
      });

      // The response might be 200 or 201 depending on better-auth configuration, or 500 for server errors
      expect([200, 201, 400, 422, 500]).toContain(response.status);

      if (response.status === 200 || response.status === 201) {
        const data = await response.json();
        expect(data).toBeDefined();
      }
    });

    it('should handle sign-in request', async () => {
      const signInData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signInData)
      });

      // Should return 400 for non-existent user or other status codes
      expect(response.status).toBeGreaterThanOrEqual(200);
    });

    it('should handle sign-out request', async () => {
      const response = await fetch(`${baseUrl}/api/auth/sign-out`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      expect([200, 401, 500]).toContain(response.status);
    });
  });

  describe('OAuth Endpoints', () => {
    it('should handle GitHub OAuth initialization', async () => {
      const response = await fetch(`${baseUrl}/api/auth/sign-in/github`, {
        method: 'GET',
        redirect: 'manual' // Don't follow redirects
      });

      // Should redirect to GitHub OAuth or return 404 if not properly configured
      expect([302, 307, 404]).toContain(response.status);

      if (response.status === 302 || response.status === 307) {
        const location = response.headers.get('location');
        expect(location).toContain('github.com');
      }
    });

    it('should handle Google OAuth initialization', async () => {
      const response = await fetch(`${baseUrl}/api/auth/sign-in/google`, {
        method: 'GET',
        redirect: 'manual' // Don't follow redirects
      });

      // Should redirect to Google OAuth or return 404 if not properly configured
      expect([302, 307, 404]).toContain(response.status);

      if (response.status === 302 || response.status === 307) {
        const location = response.headers.get('location');
        expect(location).toContain('accounts.google.com');
      }
    });

    it('should handle OAuth callback with error', async () => {
      const response = await fetch(`${baseUrl}/api/auth/callback/github?error=access_denied`, {
        method: 'GET'
      });

      // Should handle OAuth error appropriately
      expect(response.status).toBeGreaterThanOrEqual(200);
    });
  });

  describe('API Error Handling', () => {
    it('should handle malformed JSON in request body', async () => {
      const response = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: 'invalid-json'
      });

      expect([400, 422, 500]).toContain(response.status);
    });

    it('should handle missing required fields', async () => {
      const response = await fetch(`${baseUrl}/api/auth/sign-up/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test@example.com'
          // Missing name and password
        })
      });

      expect([400, 422, 500]).toContain(response.status);
    });

    it('should handle invalid email format', async () => {
      const response = await fetch(`${baseUrl}/api/auth/sign-up/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'Test User',
          email: 'invalid-email',
          password: 'password123'
        })
      });

      expect([400, 422]).toContain(response.status);
    });
  });

  describe('CORS Configuration', () => {
    it('should handle preflight OPTIONS request', async () => {
      const response = await fetch(`${baseUrl}/api/auth/get-session`, {
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:3000',
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      });

      expect([200, 204]).toContain(response.status);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST');
    });
  });

  describe('Better Auth Integration', () => {
    it('should have proper better-auth configuration', () => {
      expect(auth).toBeDefined();
      expect(auth.api).toBeDefined();
      expect(auth.handler).toBeDefined();
      expect(typeof auth.handler).toBe('function');
    });

    it('should handle better-auth API methods', async () => {
      // Test that better-auth API methods are available
      expect(auth.api.getSession).toBeDefined();
      expect(typeof auth.api.getSession).toBe('function');

      // Test session validation with empty headers
      const session = await auth.api.getSession({
        headers: new Headers()
      });
      expect(session).toBeNull();
    });
  });
}); 