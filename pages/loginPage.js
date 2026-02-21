class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorCloseButton = page.locator('.error-button');
  }
  async navigate() {
    await this.page.goto('https://www.saucedemo.com/');
  }


  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();

    try {
      // Wait for either success or error state with a reasonable timeout
      await Promise.race([
        this.page.waitForURL(/inventory/, { timeout: 5000 }),
        this.errorMessage.waitFor({ state: 'visible', timeout: 5000 })
      ]);
    } catch (e) {
      // Continue if neither condition is met within timeout
      console.log('Login state not determined, continuing...');
    }
  }

  async getErrorMessage() {
    try {
      // Add a small delay to ensure the error message has time to appear
      await this.page.waitForTimeout(500);
      await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
      return await this.errorMessage.textContent();
    } catch (e) {
      return '';
    }
  }

  async clearErrorMessage() {
    try {
      await this.errorCloseButton.waitFor({ state: 'visible', timeout: 3000 });
      await this.errorCloseButton.click();
      // Wait for error message to be hidden
      await this.errorMessage.waitFor({ state: 'hidden', timeout: 3000 });
    } catch (e) {
      console.log('Error clearing message:', e.message);
    }
  } 

  async isLoginPageLoaded() {
    return await this.loginButton.isVisible();
  }
  
  async attemptLoginWithEmptyFields() {
    await this.loginButton.click();
  }
}

module.exports = LoginPage;
