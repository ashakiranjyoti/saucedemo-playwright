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
    await this.page.goto('/');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage() {
    if (await this.errorMessage.isVisible()) {
      return await this.errorMessage.textContent();
    }
    return '';
  }

  async clearErrorMessage() {
    if (await this.errorCloseButton.isVisible()) {
      await this.errorCloseButton.click();
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