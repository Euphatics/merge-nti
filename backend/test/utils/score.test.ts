import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { calculatePercentage } from '../../src/utils/score.js';

describe('calculatePercentage', () => {
  test('returns the percentage for a valid score', () => {
    assert.equal(calculatePercentage(400, 500), 80);
  });

  test('returns 0 for zero marks obtained', () => {
    assert.equal(calculatePercentage(0, 500), 0);
  });

  test('returns 100 for a full score', () => {
    assert.equal(calculatePercentage(500, 500), 100);
  });

  test('rejects a total of zero rather than dividing by it', () => {
    assert.throws(() => calculatePercentage(10, 0), /Total marks must be greater than 0/);
  });

  test('rejects a negative total', () => {
    assert.throws(() => calculatePercentage(10, -5), /Total marks must be greater than 0/);
  });
});
