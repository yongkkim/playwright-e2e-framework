import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { CartPage } from "../pages/CartPage";

test.describe("Cart Modification and State Mutation", () => {
  // Every test uses the same demo account, so start each one with an empty cart.
  test.beforeEach(async ({ page }) => {
    await new CartPage(page).clearCart();
  });

  test("Should correctly update total price when item quantity changes", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);

    await homePage.navigate();
    await homePage.addBlueJeansToCart();

    await cartPage.goToCart();

    // Capture initial price
    const initialTotal = await cartPage.getCartTotal();

    // Change quantity to 3
    await cartPage.updateItemQuantity("3");

    // Ensure the total price has changed dynamically
    await expect(cartPage.cartTotalPrice).not.toHaveText(initialTotal);
  });
});
