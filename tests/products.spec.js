const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/loginPage');
const ProductsPage = require('../pages/ProductsPage');
const users = require('../data/users.json').users;

test.describe('Products Page Tests - POM', () => {
  let loginPage;
  let productsPage;
  let page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    
    // Login before each test
    await loginPage.navigate();
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory/);
  });

  test('Add and remove product from cart', async () => {
    const productName = 'Sauce Labs Backpack';
    
    // Add product to cart
    await productsPage.addProductToCart(productName);
    
    // Verify cart badge updates
    await expect(productsPage.cartBadge).toHaveText('1');
    
    // Verify button text changes to 'Remove'
    const product = await productsPage.getProductByName(productName);
    await expect(product.button).toContainText('Remove');
  });

  test('Remove product from cart', async () => {
    const productName = 'Sauce Labs Backpack';
    
    // First add the product
    await productsPage.addProductToCart(productName);
    await expect(productsPage.cartBadge).toHaveText('1');
    
    // Then remove it
    await productsPage.removeProductFromCart(productName);
    
    // Verify cart badge is not visible
    await expect(productsPage.cartBadge).toBeHidden();
    
    // Verify button text changes back to 'Add to cart'
    const product = await productsPage.getProductByName(productName);
    await expect(product.button).toContainText('Add to cart');
  });

  test('Add multiple products to cart', async () => {
    // Add first 2 products
    const products = page.locator('.inventory_item_name');
    const count = Math.min(await products.count(), 2);
    
    for (let i = 0; i < count; i++) {
      const productName = await products.nth(i).textContent();
      
      await page.locator('.inventory_item')
        .filter({ hasText: productName })
        .getByRole('button', { name: 'Add to cart' })
        .click();
      
      // Verify count after each addition
      await expect(page.locator('.shopping_cart_badge')).toHaveText((i + 1).toString());
    }
  });

  test('Navigate to cart page', async () => {
    // Add item first
    const firstProduct = page.locator('.inventory_item_name').first();
    const productName = await firstProduct.textContent();
    
    await page.locator('.inventory_item')
      .filter({ hasText: productName })
      .getByRole('button', { name: 'Add to cart' })
      .click();
    
    // Go to cart
    await page.locator('.shopping_cart_link').click();
    
    // Verify cart page
    await expect(page).toHaveURL(/cart/);
    await expect(page.locator('.title')).toContainText('Cart');
  });

  // ✅ TEST 5: Product details
  test('Verify product details are displayed', async ({ page }) => {
    const productItems = page.locator('.inventory_item');
    const count = await productItems.count();
    
    expect(count).toBeGreaterThan(0);
    
    // Check first product
    const firstItem = productItems.first();
    await expect(firstItem.locator('.inventory_item_name')).toBeVisible();
    await expect(firstItem.locator('.inventory_item_desc')).toBeVisible();
    await expect(firstItem.locator('.inventory_item_price')).toBeVisible();
    
    // Price format check
    const price = await firstItem.locator('.inventory_item_price').textContent();
    expect(price).toMatch(/^\$\d+\.\d{2}$/);
  });

  // ✅ TEST 6: Price format for all products
  test('All products have correct price format', async ({ page }) => {
    const prices = await page.locator('.inventory_item_price').allTextContents();
    
    for (const price of prices) {
      expect(price).toMatch(/^\$\d+\.\d{2}$/);
    }
  });

  // ✅ TEST 7: Product count
  test('Verify correct number of products', async ({ page }) => {
    const products = page.locator('.inventory_item');
    const count = await products.count();
    
    // SauceDemo has exactly 6 products
    expect(count).toBe(6);
  });
});
