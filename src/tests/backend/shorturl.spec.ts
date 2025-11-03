import { test, expect } from '../../fixtures/db-api.fixture';

function randomString(length: number) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

test('Crear short URL aleatoria y verificar en DB', async ({ api, db }) => {
  const randomSuffix = randomString(6);
  const keyword = `link${randomSuffix}`;
  const title = `TestLink${randomSuffix}`;
  const url = `https://testlink${randomSuffix}.com`;

  // --- Crear short URL vía API ---
  const apiUrl = '/yourls-api.php';
  const params = new URLSearchParams({
    signature: process.env.YOURLS_SIGNATURE || 'caed1384a5',
    action: 'shorturl',
    url,
    keyword,
    title,
    format: 'json'
  });

  const response = await api.get(`${apiUrl}?${params.toString()}`);
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  expect(data.shorturl).toBeDefined();

  // --- Validar en DB ---
  const [rows] = await db.execute(
    'SELECT keyword, url, title FROM yourls_url WHERE keyword = ? AND url = ? AND title = ?',
    [keyword, url, title]
  );
  const result = rows as any[];

  console.log('--- VALIDACIÓN DE CAMPOS ---');
  console.log('Esperado:', { keyword, url, title });
  console.log('Encontrado en DB:', result[0]);
  console.log('Coinciden:',
    result.length > 0 &&
    result[0].keyword === keyword &&
    result[0].url === url &&
    result[0].title === title
  );
  console.log('----------------------------');

  expect(result.length).toBeGreaterThan(0);
  expect(result[0]).toMatchObject({ keyword, url, title });
});
