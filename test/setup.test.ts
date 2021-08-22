import { join } from 'path';
import { rm } from 'fs/promises';
import { getConnection } from 'typeorm';

// Delete existing test DB before run each test case
global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (err) {}
});

// Close DB connection after each test
global.afterEach(async () => {
  const connection = await getConnection();
  await connection.close();
});
