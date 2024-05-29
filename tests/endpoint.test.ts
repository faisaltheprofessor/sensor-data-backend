import { afterAll, beforeAll, describe, expect, expectTypeOf, test, vi } from 'vitest'
import { truncateFile, deleteFileSync } from '../src/services/fileIOService'

describe('API endpoint tests', () => {
  afterAll(async () => {
    deleteFileSync('.data.test.json')
    vi.resetModules()
  })

  let response: Response
  let body: Array<{ [key: string]: any }>

  beforeAll(async () => {
    deleteFileSync('./data.test.json')
    vi.resetModules()
    await truncateFile('./data.test.json')
    response = await fetch('http://localhost:8000/sensors/data')
    body = await response.json()
  })

  describe('Endpint Tests', () => {
    describe('GET /sensors/data', () => {


      test('should have response status 200', () => {
        expect(response.status).toBe(200)
      })

      test('should have content-type', () => {
        expect(response.headers.get('Content-Type')).toBe('application/json; charset=utf-8')
      })

      test('should have response status 404 if route not found', async () => {
        let newResponse = await fetch('http://localhost:8000')
        expect(newResponse.status).toBe(404)

        newResponse = await fetch('http://localhost:8000')
        expect(newResponse.status).toBe(404)

      })

      test('should have an array in the body', () => {
        expectTypeOf(body).toBeArray()
      })

    })

    describe('POST /sensors/data', () => {
      test("handles CORS", () => {
        // TODO
      })
    })

  })

})