'use strict';

/**
 * V1 Contract Tests — GET /health
 *
 * These tests define the acceptance criteria for the only V1 endpoint.
 * Implementation must satisfy every assertion here before shipping.
 *
 * Test stack: Jest + Supertest
 * Run: npm test
 */

const request = require('supertest');
const app = require('../app');

describe('GET /health', () => {
  it('returns HTTP 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
  });

  it('returns JSON content-type', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['content-type']).toMatch(/application\/json/);
  });

  it('response body signals the API is functioning', async () => {
    const res = await request(app).get('/health');
    expect(res.body).toMatchObject({ status: 'ok' });
  });
});

describe('Edge conditions — /health', () => {
  it('POST /health is not accepted (404 or 405)', async () => {
    const res = await request(app).post('/health');
    expect([404, 405]).toContain(res.status);
  });

  it('PUT /health is not accepted (404 or 405)', async () => {
    const res = await request(app).put('/health');
    expect([404, 405]).toContain(res.status);
  });

  it('unknown route returns 404', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.status).toBe(404);
  });

  it('responds to requests with extra headers without error', async () => {
    const res = await request(app)
      .get('/health')
      .set('X-Custom-Header', 'whatever')
      .set('Accept', 'application/json');
    expect(res.status).toBe(200);
  });
});
