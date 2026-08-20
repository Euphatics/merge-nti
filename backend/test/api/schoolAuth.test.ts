import { describe, test, before } from 'node:test';
import assert from 'node:assert/strict';
import type { Application } from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';

/**
 * Ownership checks on school-scoped routes.
 *
 * These matter more than most: `schoolAuth` is mounted with
 * `router.use('/:schoolId', ...)`, and the whole check depends on Express
 * populating `req.params.schoolId` for a `use()` mount path. If that ever
 * stopped being true, any signed-in school could read every other school's
 * students and payments, and nothing else would look wrong.
 */
const JWT_SECRET = 'test-secret-that-is-at-least-32-characters-long';

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL ??= 'mysql://test:test@localhost:3306/test';
process.env.JWT_TOKEN = JWT_SECRET;
process.env.ADMIN_USERNAME ??= 'admin';
process.env.ADMIN_PASSWORD_HASH ??= '$2b$10$pQ7wW81xy4Xa3vpq7iZjZui1fasVCJSxBGHv9Jn0lzQkBqRWKrdHa';
process.env.CLOUDINARY_CLOUD_NAME ??= 'test';
process.env.CLOUDINARY_API_KEY ??= 'test';
process.env.CLOUDINARY_API_SECRET ??= 'test';
process.env.CLIENT_URL ??= 'http://localhost:5173';
process.env.LOG_LEVEL = 'silent';

let app: Application;

/** A valid session cookie for the given school id. */
function sessionFor(schoolId: number): string {
  const token = jwt.sign({ id: schoolId, username: `school${schoolId}` }, JWT_SECRET, {
    expiresIn: '1h',
  });
  return `token=${token}`;
}

before(async () => {
  const { createApp } = await import('../../src/app.js');
  app = createApp();
});

describe('school route ownership', () => {
  test('a school cannot read another school\'s students', async () => {
    const res = await request(app)
      .get('/api/schools/999/students')
      .set('Cookie', sessionFor(1));

    assert.equal(res.status, 403);
    assert.match(res.body.error, /your own school data/i);
  });

  test('a school cannot post students to another school', async () => {
    const res = await request(app)
      .post('/api/schools/999/students')
      .set('Cookie', sessionFor(1))
      .send({
        subjectSlug: 'mathematics',
        documentUrl: 'https://example.com/list.xlsx',
        fileName: 'list.xlsx',
        studentCount: 10,
      });

    assert.equal(res.status, 403);
  });

  test('a school cannot submit a payment against another school', async () => {
    const res = await request(app)
      .post('/api/schools/999/payment')
      .set('Cookie', sessionFor(1))
      .send({ paymentProofUrl: 'https://example.com/proof.png' });

    assert.equal(res.status, 403);
  });

  test('a school cannot delete another school\'s document', async () => {
    const res = await request(app)
      .delete('/api/schools/999/students/mathematics')
      .set('Cookie', sessionFor(1));

    assert.equal(res.status, 403);
  });

  test('an expired session is rejected with a distinct message', async () => {
    const expired = jwt.sign({ id: 1, username: 'school1' }, JWT_SECRET, { expiresIn: '-1s' });

    const res = await request(app)
      .get('/api/schools/1/students')
      .set('Cookie', `token=${expired}`);

    assert.equal(res.status, 401);
    assert.match(res.body.error, /expired/i);
  });

  test('a token signed with the wrong secret is rejected', async () => {
    const forged = jwt.sign({ id: 1, username: 'school1' }, 'a-different-secret-entirely-32ch', {
      expiresIn: '1h',
    });

    const res = await request(app)
      .get('/api/schools/1/students')
      .set('Cookie', `token=${forged}`);

    assert.equal(res.status, 401);
  });

  test('an admin token is not accepted as a school session', async () => {
    // Both audiences share JWT_SECRET, so the role claim is the only thing
    // separating them. An admin token carries no `id`.
    const adminToken = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });

    const res = await request(app)
      .get('/api/schools/1/students')
      .set('Cookie', `token=${adminToken}`);

    assert.equal(res.status, 401);
  });

  test('a non-numeric school id is rejected before any database work', async () => {
    const res = await request(app)
      .get('/api/schools/abc/students')
      .set('Cookie', sessionFor(1));

    assert.equal(res.status, 400);
  });

  test('GET /api/auth/me requires a session', async () => {
    const res = await request(app).get('/api/auth/me');
    assert.equal(res.status, 401);
  });
});
