const { expect } = require('@playwright/test');

class CheckoutPage {
  constructor(page) {
    this.page = page;

    // Cart Page
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.cartTitle = page.locator('.title').filter({ hasText: 'Your Cart' });

    // Checkout Step One
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.postalCodeInput = page.getByRole('textbox', { name: 'Zip/Postal Code' });
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.errorMessage = page.locator('[data-test="error"]');

    // Checkout Step Two
    this.finishButton = page.getByRole('button', { name: 'Finish' });
    this.paymentInfo = page.locator('.summary_info > div').nth(0);
    this.shippingInfo = page.locator('.summary_info > div').nth(1);
    this.itemTotal = page.locator('.summary_subtotal_label');
    this.tax = page.locator('.summary_tax_label');
    this.total = page.locator('.summary_total_label');

    // Complete Page
    this.successMessage = page.locator('.complete-header');
  }

  async clickCheckout() {
    await this.checkoutButton.click();
    await this.page.waitForURL(/checkout-step-one/);
  }

  async fillInformation(first, last, zip) {
    await this.firstNameInput.fill(first);
    await this.lastNameInput.fill(last);
    await this.postalCodeInput.fill(zip);
    await this.continueButton.click();
    await this.page.waitForURL(/checkout-step-two/);
  }

  async finishOrder() {
    await this.finishButton.click();
    await this.page.waitForURL(/checkout-complete/);
  }

  async getSuccessMessage() {
    return await this.successMessage.textContent();
  }

  async goToCheckout() {
    await this.checkoutButton.click();
    await this.page.waitForURL(/checkout-step-one/);
  }

  async verifyOnCheckoutStepOne() {
    await this.page.waitForURL(/checkout-step-one/);
    await this.firstNameInput.waitFor({ state: 'visible' });
  }

  async verifyOnCheckoutStepTwo() {
    await this.page.waitForURL(/checkout-step-two/);
    await this.finishButton.waitFor({ state: 'visible' });
  }

  async verifyOnCompletePage() {
    await this.page.waitForURL(/checkout-complete/);
    await this.successMessage.waitFor({ state: 'visible' });
  }
}

module.exports = CheckoutPage;
