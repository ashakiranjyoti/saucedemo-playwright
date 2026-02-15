const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/loginPage');
const InventoryPage = require('../pages/inventoryPage');
const CartPage = require('../pages/CartPage');
const users = require('../data/users.json').users;

test.describe('Cart Functionality - POM', () => {
  let loginPage;
  let inventoryPage;
  let cartPage;
  let page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    
    // Login before each test
    await loginPage.navigate();
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory/);
  });

  test('Add items to cart and verify', async ({ page }) => {

    // Test implementation

    // 2. Add items to cart
    await inventoryPage.addProduct('Sauce Labs Backpack');
    await page.waitForTimeout(1000); // Small delay between actions
    await inventoryPage.addProduct('Sauce Labs Bike Light');
    
    // 3. Go to cart and verify items
    await page.waitForTimeout(1000); // Ensure items are added
    await inventoryPage.goToCart();
    await page.waitForURL('**/cart.html');
    await cartPage.verifyOnCartPage();
    
    // 4. Verify cart items
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(2);
    
    const itemNames = await cartPage.getItemNames();
    expect(itemNames).toContain('Sauce Labs Backpack');
    expect(itemNames).toContain('Sauce Labs Bike Light');
  });

  test('Remove item from cart', async ({ page }) => {
    // 1. Add item to cart
    await inventoryPage.addProduct('Sauce Labs Backpack');
    await page.waitForTimeout(1000); // Ensure item is added
    await inventoryPage.goToCart();
    await page.waitForURL('**/cart.html');
    
    // 2. Remove item and verify
    await cartPage.removeItem('Sauce Labs Backpack');
    await page.waitForSelector('div.cart_item:nth-child(1) > div.cart_item_label > div.inventory_item_name', { state: 'hidden' });
    expect(await cartPage.getCartItemCount()).toBe(0);
  });

  test('Continue shopping works', async () => {
    // Go to cart
    await inventoryPage.goToCart();
    
    // 2. Test continue shopping
    await cartPage.continueShopping();
    await expect(page).toHaveURL(/inventory/);
  });

  test('Checkout button works', async () => {
    // Go to cart
    await inventoryPage.goToCart();
    
    // 2. Test checkout
    await cartPage.goToCheckout();
    await expect(page).toHaveURL(/checkout-step-one/);
  });
});
