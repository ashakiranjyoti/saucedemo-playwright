const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const users = require('../data/users.json').users;

test.describe('Login Tests', () => {
  test('Successful login with standard user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.navigate();
    await loginPage.login(users.standard.username, users.standard.password);
    
    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('Login with invalid credentials shows error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.navigate();
    await loginPage.login('invalid_user', 'wrong_password');
    
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Username and password do not match');
  });

  test('Locked out user cannot login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.navigate();
    await loginPage.login(users.locked.username, users.locked.password);
    
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Sorry, this user has been locked out');
  });

  test('Required fields validation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.navigate();
    
    await loginPage.attemptLoginWithEmptyFields();
    let error = await loginPage.getErrorMessage();
    expect(error).toContain('Username is required');
    
    await loginPage.clearErrorMessage();
    
    await loginPage.passwordInput.fill('secret_sauce');
    await loginPage.loginButton.click();
    error = await loginPage.getErrorMessage();
    expect(error).toContain('Username is required');
    
    await loginPage.clearErrorMessage();
    
    await loginPage.usernameInput.fill('standard_user');
    await loginPage.passwordInput.fill('');
    await loginPage.loginButton.click();
    error = await loginPage.getErrorMessage();
    expect(error).toContain('Password is required');
  });
  
  test('Error message can be closed', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.navigate();
    await loginPage.attemptLoginWithEmptyFields();
    
    await expect(loginPage.errorMessage).toBeVisible();
    
    await loginPage.clearErrorMessage();
    
    await expect(loginPage.errorMessage).toBeHidden();
  });
});