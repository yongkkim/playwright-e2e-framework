import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";
import { CartPage } from "../pages/CartPage";

test.describe("Session Persistence", () => {
  // Every test uses the same demo account, so start each one with an empty cart.
  test.beforeEach(async ({ page }) => {
    await new CartPage(page).clearCart();
  });

  test("Should retain cart items after logout and re-login", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);

    await homePage.navigate();
    await homePage.addBlueJeansToCart();

    // 2. Logout (Destroy frontend session)
    await loginPage.performLogout();

    // 3. Re-login and verify backend retained the cart data
    await loginPage.navigateToLogin();
    await loginPage.performLogin("world@hotmail.com", "qwerty123");

    await cartPage.goToCart();
    const cartBadge = page.locator(".cart-qty");
    // The cart was emptied before the test and one item was added.
    await expect(cartBadge).toHaveText("(1)");
  });
});
