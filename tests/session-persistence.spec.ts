import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";
import { CartPage } from "../pages/CartPage";

test.describe("Session Persistence", () => {
  //   test.beforeEach(async ({ page }) => {
  //     await page.route("**/*.{png,jpg,jpeg,gif}", (route) => route.abort());
  //   });

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
    await expect(cartBadge).not.toHaveText("(0)");
  });
});
