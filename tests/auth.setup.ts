import { test as setup, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

// Define the path where the session (cookies/localStorage) will be saved
const authFile = "playwright/.auth/user.json";

setup("Authenticate and save session", async ({ page }) => {
  const loginPage = new LoginPage(page);

  // 1. Perform standard login
  await loginPage.navigateToLogin();
  await loginPage.performLogin("world@hotmail.com", "qwerty123");

  // 2. Wait until login is successful (e.g., user email appears in the header)
  await expect(page.locator(".account").first()).toBeVisible();

  // 3. Save the session cookie to a file
  await page.context().storageState({ path: authFile });
});
