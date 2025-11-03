import { test, expect } from '@playwright/test';
import mysql, { RowDataPacket } from 'mysql2/promise';

function randomString(length: number) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

test('Crear short URL aleatoria y verificar en DB', async ({ request }) => {
  const randomSuffix = randomString(6);
  const keyword = `link${randomSuffix}`;
  const title = `TestLink${randomSuffix}`;
  const url = `https://testlink${randomSuffix}.com`;
  const apiUrl = 'http://localhost:8080/yourls-api.php';
  const params = new URLSearchParams({
    signature: 'caed1384a5',
    action: 'shorturl',
    url,
    keyword,
    title,
    format: 'json',
  });

  const response = await request.get(`${apiUrl}?${params.toString()}`);
  expect(response.ok()).toBeTruthy();
  const data = await response.json();

  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'yourlsv1',
  });

  const [rows] = await connection.execute<RowDataPacket[]>(
    'SELECT keyword, url, title FROM yourls_url WHERE keyword = ? AND url = ? AND title = ?',
    [keyword, url, title]
  );

  const result = rows as RowDataPacket[];

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
  expect(result[0]).toMatchObject({
    keyword,
    url,
    title,
  });

  await connection.end();
});
