import { describe, test, before } from 'node:test';
import assert from 'node:assert/strict';
import type { Application } from 'express';
import request from 'supertest';

/**
 * Route-level tests that exercise the real middleware stack.
 *
 * The environment is populated before `createApp` is imported, because
 * config/env.ts validates and freezes it at module load.
 */
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL ??= 'mysql://test:test@localhost:3306/test';
process.env.JWT_TOKEN ??= 'test-secret-that-is-at-least-32-characters-long';
process.env.ADMIN_USERNAME ??= 'admin';
process.env.ADMIN_PASSWORD_HASH ??= '$2b$10$pQ7wW81xy4Xa3vpq7iZjZui1fasVCJSxBGHv9Jn0lzQkBqRWKrdHa';
process.env.CLOUDINARY_CLOUD_NAME ??= 'test';
process.env.CLOUDINARY_API_KEY ??= 'test';
process.env.CLOUDINARY_API_SECRET ??= 'test';
process.env.CLIENT_URL ??= 'http://localhost:5173';
process.env.LOG_LEVEL = 'silent';

let app: Application;

before(async () => {
  const { createApp } = await import('../../src/app.js');
  app = createApp();
});

describe('health', () => {
  test('GET /health reports ok', async () => {
    const res = await request(app).get('/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'ok');
    assert.equal(typeof res.body.uptime, 'number');
  });

  test('GET /api/health is also available', async () => {
    const res = await request(app).get('/api/health');
    assert.equal(res.status, 200);
  });
});

describe('not found handling', () => {
  test('an unknown route returns JSON, not an HTML error page', async () => {
    const res = await request(app).get('/api/definitely-not-a-route');
    assert.equal(res.status, 404);
    assert.match(res.headers['content-type'], /application\/json/);
    assert.ok(typeof res.body.error === 'string');
  });
});

describe('security headers', () => {
  test('the framework fingerprint is not advertised', async () => {
    const res = await request(app).get('/health');
    assert.equal(res.headers['x-powered-by'], undefined);
  });

  test('helmet sets its baseline headers', async () => {
    const res = await request(app).get('/health');
    assert.equal(res.headers['x-content-type-options'], 'nosniff');
  });
});

describe('request validation', () => {
  test('registering with no body reports every missing field at once', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    assert.equal(res.status, 400);
    assert.equal(res.body.error, 'Validation failed');
    assert.ok(Array.isArray(res.body.details));

    const fields = res.body.details.map((d: { field: string }) => d.field);
    for (const expected of ['schoolName', 'email', 'username', 'password']) {
      assert.ok(fields.includes(expected), `expected a complaint about "${expected}"`);
    }
  });

  test('a malformed email is rejected before touching the database', async () => {
    const res = await request(app).post('/api/auth/register').send({
      schoolName: 'Test School',
      email: 'not-an-email',
      username: 'testschool',
      password: 'password123',
    });
    assert.equal(res.status, 400);
    const fields = res.body.details.map((d: { field: string }) => d.field);
    assert.ok(fields.includes('email'));
  });

  test('a weak password is rejected', async () => {
    const res = await request(app).post('/api/auth/register').send({
      schoolName: 'Test School',
      email: 'valid@example.com',
      username: 'testschool',
      password: 'short',
    });
    assert.equal(res.status, 400);
    const fields = res.body.details.map((d: { field: string }) => d.field);
    assert.ok(fields.includes('password'));
  });

  test('admin login rejects an empty body', async () => {
    const res = await request(app).post('/api/admin/login').send({});
    assert.equal(res.status, 400);
    assert.equal(res.body.error, 'Validation failed');
  });
});

describe('authentication guards', () => {
  test('the school panel data endpoint refuses an anonymous caller', async () => {
    const res = await request(app).get('/api/schools/1/students');
    assert.equal(res.status, 401);
    assert.match(res.headers['content-type'], /application\/json/);
  });

  test('admin endpoints refuse a request with no Bearer token', async () => {
    const res = await request(app).get('/api/admin/stats');
    assert.equal(res.status, 401);
  });

  test('admin endpoints refuse a malformed token', async () => {
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', 'Bearer not-a-real-token');
    assert.equal(res.status, 401);
  });

  test('uploading without credentials is refused', async () => {
    const res = await request(app).post('/api/upload');
    assert.equal(res.status, 401);
  });
});

describe('CORS', () => {
  test('an unlisted origin is not granted credentials', async () => {
    const res = await request(app).get('/api/health').set('Origin', 'https://evil.example.com');
    assert.equal(res.headers['access-control-allow-origin'], undefined);
  });

  test('the configured client origin is allowed', async () => {
    const res = await request(app).get('/api/health').set('Origin', 'http://localhost:5173');
    assert.equal(res.headers['access-control-allow-origin'], 'http://localhost:5173');
    assert.equal(res.headers['access-control-allow-credentials'], 'true');
  });
});
