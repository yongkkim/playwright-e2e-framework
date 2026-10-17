import { test } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";

test.describe("Checkout Happy Path", () => {
  //   test.beforeEach(async ({ page }) => {
  //     await page.route("**/*.{png,jpg,jpeg,gif}", (route) => route.abort());
  //     await page.goto("https://demowebshop.tricentis.com/");
  //   });

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
