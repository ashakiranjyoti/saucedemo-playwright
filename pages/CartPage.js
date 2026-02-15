const { expect } = require('@playwright/test');

class CartPage {
  constructor(page) {
    this.page = page;

    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    this.cartTitle = page.locator('.title');
  }

  async verifyOnCartPage() {
    await expect(this.page).toHaveURL(/cart/);
    await expect(this.cartTitle).toHaveText('Your Cart');
  }

  async getCartItemCount() {
    return await this.cartItems.count();
  }

  async getItemNames() {
    return await this.cartItems.locator('.inventory_item_name').allTextContents();
  }

  async removeItem(productName) {
    await this.page.locator('.cart_item')
      .filter({ hasText: productName })
      .getByRole('button', { name: 'Remove' })
      .click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async goToCheckout() {
    await this.checkoutButton.click();
  }
}

module.exports = CartPage;
