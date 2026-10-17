import { type Locator, type Page } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly apparelAndShoesLink: Locator;
  readonly notificationBar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.apparelAndShoesLink = page
      .locator(".top-menu")
      .getByRole("link", { name: "Apparel & Shoes" });
    this.notificationBar = page.locator("#bar-notification");
  }

  async navigate() {
    await this.page.goto("/");
  }

  async addBlueJeansToCart() {
    // 1. Go to category
    await this.apparelAndShoesLink.click();

    // 2. Find Blue Jeans in the grid and click Add to cart
    const productItem = this.page
      .locator(".product-item")
      .filter({ hasText: "Blue Jeans" });
    await productItem.getByRole("button", { name: "Add to cart" }).click();

    // 3. Wait for the success banner to ensure it's added before moving on
    await this.notificationBar.waitFor({ state: "visible" });
  }
}
