import { test, expect } from '@playwright/test';
import mysql from 'mysql2/promise';

test('Conectar a MySQL y leer datos', async () => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'yourlsv1',
  });

  const [rows] = await connection.execute('SHOW TABLES;');
  console.log('Tablas en la base de datos:', rows);
  expect(Array.isArray(rows)).toBeTruthy();

  await connection.end();
});
