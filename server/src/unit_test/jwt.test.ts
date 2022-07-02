import request from 'supertest';
import { jest } from '@jest/globals';
import req from '../app';
import { generateToken, validateToken } from '../jwt';

describe('Test Creation and Verification of Jwt', () => {
  it('creates correct jwt and returns decoded value', async () => {
    const result = generateToken('e4061d7a-6c09-4846-846c-9e579ec9f9b4');
    const valid = await validateToken(`Bearer ${result}`);
    expect(valid).toBeDefined();
    expect(valid).toHaveProperty('uuid');
    expect(result).toBeDefined();
  });
});
