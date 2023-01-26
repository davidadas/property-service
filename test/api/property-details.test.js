const assert = require('assert');
const nock = require('nock');
const request = require('supertest');
const { mockGetPropertyDetails } = require('../mocks/house-canary.mocks');
const app = require('../../src');

// We've disabled auth for this service, but will keep this for completeness anyway.
const dummyToken = 'W29iamVjdCBPYmplY3Rd';

describe('Property Details API', () => {
  beforeEach(() => {
    nock.cleanAll(); // Clear all HTTP interceptors.
  });

  describe('HouseCanary API', () => {
    it('should confirm presence of septic system', async () => {
      const query = { address: '1234 Fake Street', zipcode: '12345' };
      mockGetPropertyDetails(query, 200, { result: { property: { sewer: 'septic' } } });

      const result = await request(app)
        .get('/property')
        .query(query)
        .set('Authorization', `Bearer ${dummyToken}`)
        .expect(200);

      assert.equal(result.body.hasSeptic, true);
    });

    it('should confirm presence of septic system regardless of casing and presence of spaces', async () => {
      const query = { address: '1234 Fake Street', zipcode: '12345' };
      mockGetPropertyDetails(query, 200, { result: { property: { sewer: ' SePtIc  ' } } });

      const result = await request(app)
        .get('/property')
        .query(query)
        .set('Authorization', `Bearer ${dummyToken}`)
        .expect(200);

      assert.equal(result.body.hasSeptic, true);
    });

    it('should conclude septic system not present when none are identified', async () => {
      const query = { address: '1234 Fake Street', zipcode: '12345' };
      mockGetPropertyDetails(query, 200, { result: { property: { sewer: 'somethingElse' } } });

      const result = await request(app)
        .get('/property')
        .query(query)
        .set('Authorization', `Bearer ${dummyToken}`)
        .expect(200);

      assert.equal(result.body.hasSeptic, false);
    });

    it('should not error if HouseCanary returns no result', async () => {
      const query = { address: '1234 Fake Street', zipcode: '12345' };
      mockGetPropertyDetails(query, 200, {});

      const result = await request(app)
        .get('/property')
        .query(query)
        .set('Authorization', `Bearer ${dummyToken}`)
        .expect(200);

      assert.equal(result.body.hasSeptic, false);
    });

    it('should not error if HouseCanary returns no \'property\' is returned in the result', async () => {
      const query = { address: '1234 Fake Street', zipcode: '12345' };
      mockGetPropertyDetails(query, 200, { result: {} });

      const result = await request(app)
        .get('/property')
        .query(query)
        .set('Authorization', `Bearer ${dummyToken}`)
        .expect(200);

      assert.equal(result.body.hasSeptic, false);
    });

    it('should not error no data is provided', async () => {
      const query = {};
      mockGetPropertyDetails(query, 200, { result: {} });

      const result = await request(app)
        .get('/property')
        .query(query)
        .set('Authorization', `Bearer ${dummyToken}`)
        .expect(200);

      assert.equal(result.body.hasSeptic, false);
    });
  });

  it('should throw an error if address is > 3 characters', async () => {
    await request(app)
      .get('/property')
      .query({ address: '12' })
      .set('Authorization', `Bearer ${dummyToken}`)
      .expect(400);
  });
});
