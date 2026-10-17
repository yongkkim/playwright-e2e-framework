import { type Locator, type Page } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly shoppingCartLink: Locator;
  readonly termsCheckbox: Locator;
  readonly checkoutButton: Locator;
  readonly qtyInput: Locator;
  readonly updateCartBtn: Locator;
  readonly cartTotalPrice: Locator;

  constructor(page: Page) {
    this.page = page;
    this.shoppingCartLink = page
      .getByRole("link", { name: "Shopping cart" })
      .first();
    this.termsCheckbox = page.locator("#termsofservice");
    this.checkoutButton = page.getByRole("button", { name: "Checkout" });
    this.qtyInput = page.locator(".qty-input").first();
    this.updateCartBtn = page.getByRole("button", {
      name: "Update shopping cart",
    });
    this.cartTotalPrice = page.locator(".product-subtotal");
  }

  async goToCart() {
    await this.shoppingCartLink.click();
  }

  async proceedToCheckout() {
    // Must agree to terms of service before checking out
    await this.termsCheckbox.check();
    await this.checkoutButton.click();
  }

  async updateItemQuantity(quantity: string) {
    await this.qtyInput.fill(quantity);
    await this.updateCartBtn.click();
  }

  async getCartTotal(): Promise<string> {
    await this.cartTotalPrice.waitFor({ state: "visible" });
    return await this.cartTotalPrice.innerText();
  }
}
