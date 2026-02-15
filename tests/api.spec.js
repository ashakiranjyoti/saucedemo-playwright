const { test, expect } = require('@playwright/test');

test('API GET Users', async ({ request }) => {
  const response = await request.get('https://reqres.in/api/users/2');
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.data.id).toBe(2);
});
