import { type Locator, type Page } from "@playwright/test";

export class LoginPage {
  // 1. Declare properties (Locators)
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly loginLinkTopNav: Locator;
  readonly logoutLinkTopNav: Locator;

  // 2. Initialize locators in the constructor
  constructor(page: Page) {
    this.page = page;
    this.loginLinkTopNav = page.getByRole("link", { name: "Log in" });
    this.emailInput = page.locator("#Email");
    this.passwordInput = page.locator("#Password");
    this.loginButton = page.getByRole("button", { name: "Log in" });
    this.logoutLinkTopNav = page.getByRole("link", { name: "Log out" });
  }

  // 3. Define Actions (Methods)
  async navigateToLogin() {
    await this.page.goto("https://demowebshop.tricentis.com/");
    await this.loginLinkTopNav.click();
  }

  async performLogin(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async performLogout() {
    await this.logoutLinkTopNav.click();
  }
}
