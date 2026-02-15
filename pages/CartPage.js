// pages/CartPage.js - COMPLETE WORKING VERSION
class CartPage {
  constructor(page) {
    this.page = page;
    
    // ✅ FIXED: Use data-test attributes for reliability
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.cartTitle = page.locator('.title');
  }

  async getCartItems() {
    const items = [];
    const count = await this.cartItems.count();
    
    for (let i = 0; i < count; i++) {
      const item = this.cartItems.nth(i);
      const name = await item.locator('.inventory_item_name').textContent();
      const price = await item.locator('.inventory_item_price').textContent();
      const quantity = await item.locator('.cart_quantity').textContent().catch(() => '1');
      
      items.push({ 
        name: name.trim(), 
        price: price.trim(),
        quantity: quantity.trim()
      });
    }
    
    return items;
  }

  async removeItem(itemName) {
    // Find cart item by name and click Remove button
    await this.page.locator('.cart_item')
      .filter({ has: this.page.locator('.inventory_item_name', { hasText: itemName }) })
      .locator('button')
      .filter({ hasText: 'Remove' })
      .click();
    
    // Wait for item to be removed
    await this.page.waitForTimeout(500);
  }

  async goToCheckout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async getCartItemCount() {
    return await this.cartItems.count();
  }

  async isCartEmpty() {
    const count = await this.cartItems.count();
    return count === 0;
  }

  async verifyOnCartPage() {
    await expect(this.page).toHaveURL(/cart/);
    await expect(this.cartTitle).toHaveText('Your Cart');
    return true;
  }
}

module.exports = CartPage;