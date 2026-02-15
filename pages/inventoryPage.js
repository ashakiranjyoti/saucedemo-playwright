class InventoryPage {
  constructor(page) {
    this.page = page;
    this.firstAddBtn = '.inventory_item button';
    this.cartIcon = '.shopping_cart_link';
  }

  async addFirstProduct() {
    await this.page.locator(this.firstAddBtn).first().click();
  }

  async openCart() {
    await this.page.click(this.cartIcon);
  }
}

module.exports = { InventoryPage };
