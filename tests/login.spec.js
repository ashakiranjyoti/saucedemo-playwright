const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');

test('Valid Login Test', async ({ page }) => {
  const login = new LoginPage(page);

  await login.goto();
  await login.login('standard_user', 'secret_sauce');

  await expect(page).toHaveURL(/inventory/);
});
