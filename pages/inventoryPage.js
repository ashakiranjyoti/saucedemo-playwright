class InventoryPage {
  constructor(page) {
    this.page = page;
    this.cartIcon = page.locator('.shopping_cart_link');
    this.inventoryItems = page.locator('.inventory_item');
    this.addToCartButtons = page.locator('button').filter({ hasText: 'Add to cart' });
  }

  async addProduct(productName) {
    const product = this.page.locator('.inventory_item') 
      .filter({ has: this.page.getByText(productName, { exact: true }) });
    await product.getByRole('button', { name: 'Add to cart' }).click();
  }

  async addFirstProduct() {
    // Add the first product in the inventory list
    await this.addToCartButtons.first().click();
  }

  async addProductByName(productName) {
    await this.addProduct(productName);
  }

  async goToCart() {
    await this.cartIcon.click();
  }

  async openCart() {
    await this.goToCart();
  }

  async getInventoryItemNames() {
    return this.page.locator('.inventory_item_name').allTextContents();
  }
}

module.exports = InventoryPage;
