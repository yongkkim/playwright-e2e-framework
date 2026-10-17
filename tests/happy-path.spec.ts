import { test } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";

test.describe("Checkout Happy Path", () => {
  // Every test uses the same demo account, so start each one with an empty cart.
  test.beforeEach(async ({ page }) => {
    await new CartPage(page).clearCart();
  });

  test("Should successfully complete checkout process", async ({ page }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await homePage.navigate();
    await homePage.addBlueJeansToCart();

    await cartPage.goToCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.completeCheckoutSteps();
    await checkoutPage.verifyOrderSuccess();
  });
});
