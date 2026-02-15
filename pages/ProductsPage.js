// pages/ProductsPage.js - SIMPLE WORKING VERSION
class ProductsPage {
  constructor(page) {
    this.page = page;
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
  }

  async addProductToCart(productName) {
    // Find product by exact name
    const product = this.page.locator('.inventory_item')
      .filter({ has: this.page.getByText(productName, { exact: true }) });
    
    await product.locator('button').filter({ hasText: 'Add to cart' }).click();
  }

  async removeProductFromCart(productName) {
    // Find product by exact name
    const product = this.page.locator('.inventory_item')
      .filter({ has: this.page.getByText(productName, { exact: true }) });
    
    await product.locator('button').filter({ hasText: 'Remove' }).click();
  }

  async goToCart() {
    await this.cartLink.click();
  }
  
  async getProductByName(productName) {
    const product = this.page.locator('.inventory_item')
      .filter({ has: this.page.getByText(productName, { exact: true }) });
    return {
      button: product.locator('button')
    };
  }
  
  async getCartBadgeCount() {
    const count = await this.cartBadge.textContent();
    return parseInt(count, 10);
  }
}

module.exports = ProductsPage;