const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/loginPage');
const users = require('../data/users.json').users;

test.describe('Login Tests', () => {
  test('Login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('.title')).toContainText('Products');
  });

  test('Login with invalid credentials shows error', async ({ page, browserName }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('invalid_user', 'invalid_password');
    
    // Add a small delay for Firefox
    if (browserName === 'firefox') {
      await page.waitForTimeout(1000);
    }
    
    // Verify we're still on login page
    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
    
    // Check for error message
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toMatch(/(Username and password do not match|Epic sadface: Username and password do not match)/i);
  });

  test('Locked out user cannot login', async ({ page, browserName }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(users.locked.username, users.locked.password);
    
    // Add a small delay for Firefox
    if (browserName === 'firefox') {
      await page.waitForTimeout(1000);
    }
    
    // Verify we're still on login page
    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
    
    // Check for error message
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toMatch(/(Sorry, this user has been locked out|Epic sadface: Sorry, this user has been locked out)/i);
  });

  test('Empty username shows error', async ({ page, browserName }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    
    // For Firefox, clear any pre-filled values
    if (browserName === 'firefox') {
      await loginPage.usernameInput.fill('');
      await loginPage.passwordInput.fill('');
    }
    
    await loginPage.attemptLoginWithEmptyFields();
    
    // Add a small delay for Firefox
    if (browserName === 'firefox') {
      await page.waitForTimeout(1000);
    }
    
    // Check for error message
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toMatch(/(Username is required|Epic sadface: Username is required)/i);
  });

  test('Empty password shows error', async ({ page, browserName }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    
    // For Firefox, ensure fields are in a clean state
    if (browserName === 'firefox') {
      await loginPage.usernameInput.fill('');
      await loginPage.passwordInput.fill('');
    }
    
    await loginPage.usernameInput.fill('standard_user');
    await loginPage.loginButton.click();
    
    // Add a small delay for Firefox
    if (browserName === 'firefox') {
      await page.waitForTimeout(1000);
    }
    
    // Check for error message
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toMatch(/(Password is required|Epic sadface: Password is required)/i);
  });

  test('Error message can be closed', async ({ page, browserName }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.navigate();
    
    // For Firefox, ensure fields are in a clean state
    if (browserName === 'firefox') {
      await loginPage.usernameInput.fill('');
      await loginPage.passwordInput.fill('');
    }
    
    await loginPage.attemptLoginWithEmptyFields();
    
    // Add a small delay for Firefox
    if (browserName === 'firefox') {
      await page.waitForTimeout(1000);
    }
    
    // Verify error message is visible
    await expect(loginPage.errorMessage).toBeVisible();
    
    // Clear the error message
    await loginPage.clearErrorMessage();
    
    // Add a small delay for Firefox
    if (browserName === 'firefox') {
      await page.waitForTimeout(500);
    }
    
    // Verify error message is hidden
    await expect(loginPage.errorMessage).toBeHidden();
  });
});
