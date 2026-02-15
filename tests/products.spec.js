const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const users = require('../data/users.json').users;

// ✅ Simple tests without complex Page Objects
test.describe('Products Page Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Direct login
    await page.goto('https://www.saucedemo.com/');
    await page.getByRole('textbox', { name: 'Username' }).fill(users.standard.username);
    await page.getByRole('textbox', { name: 'Password' }).fill(users.standard.password);
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Wait for products page
    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('.title')).toHaveText('Products');
  });

  // ✅ TEST 1: Add to cart
  test('Add product to cart', async ({ page }) => {
    // Get first product name
    const firstProduct = page.locator('.inventory_item_name').first();
    const productName = await firstProduct.textContent();
    
    // Add to cart
    await page.locator('.inventory_item')
      .filter({ hasText: productName })
      .getByRole('button', { name: 'Add to cart' })
      .click();
    
    // Verify
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  // ✅ TEST 2: Remove from cart
  test('Remove product from cart', async ({ page }) => {
    // First add
    const firstProduct = page.locator('.inventory_item_name').first();
    const productName = await firstProduct.textContent();
    
    await page.locator('.inventory_item')
      .filter({ hasText: productName })
      .getByRole('button', { name: 'Add to cart' })
      .click();
    
    // Verify added
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    
    // Remove
    await page.locator('.inventory_item')
      .filter({ hasText: productName })
      .getByRole('button', { name: 'Remove' })
      .click();
    
    // Verify removed
    await expect(page.locator('.shopping_cart_badge')).toBeHidden();
  });

  // ✅ TEST 3: Add multiple products
  test('Add multiple products to cart', async ({ page }) => {
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

  // ✅ TEST 4: Go to cart
  test('Navigate to cart page', async ({ page }) => {
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