const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/loginPage');
const InventoryPage = require('../pages/inventoryPage');
const CheckoutPage = require('../pages/CheckoutPage');
const CartPage = require('../pages/CartPage');
const users = require('../data/users.json').users;

const testUser = {
  firstName: 'Ashakiran',
  lastName: 'Jyoti',
  zipCode: '411052'
};

test.describe('Checkout Process - POM', () => {
  let loginPage;
  let inventoryPage;
  let cartPage;
  let checkoutPage;
  let page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    // Initialize page objects
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    // Login and add product to cart
    await loginPage.navigate();
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory/);
    await inventoryPage.addFirstProduct();
    await inventoryPage.openCart();
  });

  test('Complete checkout flow with valid information', async () => {
    // Start checkout
    await cartPage.goToCheckout();
    
    // Fill checkout information
    await checkoutPage.fillInformation(
      testUser.firstName,
      testUser.lastName,
      testUser.zipCode
    );
    
    // Complete order
    await checkoutPage.finishOrder();
    
    // Verify success message
    const message = await checkoutPage.getSuccessMessage();
    expect(message).toContain('Thank you for your order!');
  });

  test('Verify order summary information', async () => {
    // Start checkout
    await cartPage.goToCheckout();
    
    // Fill checkout information
    await checkoutPage.fillInformation(
      testUser.firstName,
      testUser.lastName,
      testUser.zipCode
    );
    
    // Verify we're on checkout step two
    await checkoutPage.verifyOnCheckoutStepTwo();
    
    // Verify order summary
    await expect(checkoutPage.paymentInfo).toBeVisible();
    await expect(checkoutPage.shippingInfo).toBeVisible();
    await expect(checkoutPage.itemTotal).toBeVisible();
    await expect(checkoutPage.tax).toBeVisible();
    await expect(checkoutPage.total).toBeVisible();
  });

  test('Cancel checkout from information page', async () => {
    // Start checkout
    await cartPage.goToCheckout();
    
    // Verify we're on checkout step one
    await checkoutPage.verifyOnCheckoutStepOne();
    
    // Click cancel
    await checkoutPage.cancelButton.click();
    
    // Should return to cart page
    await expect(checkoutPage.cartTitle).toBeVisible();
    await expect(checkoutPage.cartTitle).toHaveText('Your Cart');
  });

  test('Cancel checkout from overview page', async () => {
    // Start checkout and fill information
    await cartPage.goToCheckout();
    await checkoutPage.fillInformation(
      testUser.firstName,
      testUser.lastName,
      testUser.zipCode
    );
    
    // Verify we're on checkout step two
    await checkoutPage.verifyOnCheckoutStepTwo();
    
    // Click cancel
    await checkoutPage.cancelButton.click();
    
    // Should return to inventory page
    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('Verify required field validations', async () => {
    // Start checkout
    await cartPage.goToCheckout();
    
    // Verify we're on checkout step one
    await checkoutPage.verifyOnCheckoutStepOne();
    
    // Try to continue without filling any fields
    await checkoutPage.continueButton.click();
    
    // Verify error message
    await expect(checkoutPage.errorMessage).toBeVisible();
    const errorText = await checkoutPage.errorMessage.textContent();
    expect(errorText).toContain('First Name is required');
    
    // Fill only first name and try again
    await checkoutPage.firstNameInput.fill('Test');
    await checkoutPage.continueButton.click();
    const lastNameError = await checkoutPage.errorMessage.textContent();
    expect(lastNameError).toContain('Last Name is required');
    
    // Fill only first and last name
    await checkoutPage.lastNameInput.fill('User');
    await checkoutPage.continueButton.click();
    const postalCodeError = await checkoutPage.errorMessage.textContent();
    expect(postalCodeError).toContain('Postal Code is required');
  });
});

