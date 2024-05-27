import { afterAll, beforeAll, beforeEach, describe, expect, expectTypeOf, test, vi } from 'vitest';
import { deleteFile, truncateFile } from '../src/services/fileIOService';
import { before } from 'node:test';

describe('API endpoint tests', () => {
    afterAll( async() => {
        vi.resetModules()
    })
 
    let response: Response;
    let body: Array<{ [key: string]: unknown }>;
  
    describe('GET /sensors/data', () => {
      beforeAll(async () => {
        await truncateFile('./data.test.json');
        response = await fetch('http://localhost:8000/sensors/data');
        body = await response.json();
      });
  
      test('should have response status 200', () => {
        expect(response.status).toBe(200);
      });
  
      test('should have content-type', () => {
        expect(response.headers.get('Content-Type')).toBe('application/json; charset=utf-8');
      });
  
      test('should have an array in the body', () => {
        expectTypeOf(body).toBeArray();
      });
    });
  });
  