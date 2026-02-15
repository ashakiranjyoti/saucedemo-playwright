// tests/cart.spec.js - SIMPLE DIRECT APPROACH
const { test, expect } = require('@playwright/test');

test.describe('Cart Functionality Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Step 1: Login
    await page.goto('https://www.saucedemo.com/');
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Step 2: Verify on products page
    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('.title')).toHaveText('Products');
    
    // Step 3: Add 2 products to cart
    // Add Backpack
    await page.locator('.inventory_item')
      .filter({ has: page.getByText('Sauce Labs Backpack') })
      .getByRole('button', { name: 'Add to cart' })
      .click();
    
    // Add Bike Light  
    await page.locator('.inventory_item')
      .filter({ has: page.getByText('Sauce Labs Bike Light') })
      .getByRole('button', { name: 'Add to cart' })
      .click();
    
    // Step 4: Go to cart
    await page.locator('.shopping_cart_link').click();
    
    // Step 5: Verify on cart page
    await expect(page).toHaveURL(/cart/);
    await expect(page.locator('.title')).toHaveText('Your Cart');
  });

  test('Verify cart page has correct items', async ({ page }) => {
    // Check cart has 2 items
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(2);
    
    // Check item names
    const itemNames = await cartItems.locator('.inventory_item_name').allTextContents();
    expect(itemNames).toContain('Sauce Labs Backpack');
    expect(itemNames).toContain('Sauce Labs Bike Light');
  });

  test('Remove item from cart', async ({ page }) => {
    // Remove Backpack
    await page.locator('.cart_item')
      .filter({ has: page.getByText('Sauce Labs Backpack') })
      .getByRole('button', { name: 'Remove' })
      .click();
    
    // Wait for removal
    await page.waitForTimeout(500);
    
    // Should have 1 item now
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(1);
    
    // Should be Bike Light
    const remainingItem = await cartItems.locator('.inventory_item_name').textContent();
    expect(remainingItem).toBe('Sauce Labs Bike Light');
  });

  test('Continue shopping button works', async ({ page }) => {
    // Click Continue Shopping
    await page.getByRole('button', { name: 'Continue Shopping' }).click();
    
    // Should go back to products page
    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('.title')).toHaveText('Products');
    
    // Cart should still show 2 items
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
  });

  test('Checkout button works', async ({ page }) => {
    // Click Checkout
    await page.getByRole('button', { name: 'Checkout' }).click();
    
    // Should go to checkout page
    await expect(page).toHaveURL(/checkout-step-one/);
    await expect(page.locator('.title')).toHaveText('Checkout: Your Information');
  });
});