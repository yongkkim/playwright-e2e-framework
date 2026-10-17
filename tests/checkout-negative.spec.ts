import { test } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";

test.describe("Checkout Negative Scenarios", () => {
  // Every test uses the same demo account, so start each one with an empty cart.
  test.beforeEach(async ({ page }) => {
    await new CartPage(page).clearCart();
  });

  test("Should display error when required checkout fields are missing", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await homePage.navigate();
    await homePage.addBlueJeansToCart();

    await cartPage.goToCart();
    await cartPage.proceedToCheckout();

    // Attempt to submit empty billing info
    await checkoutPage.triggerBillingValidationError();

    // Verify system blocks progress and shows correct error
    await checkoutPage.verifyZipCodeErrorIsDisplayed();
  });
});
