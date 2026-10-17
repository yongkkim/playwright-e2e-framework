import { type Locator, type Page, expect } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly shoppingCartLink: Locator;
  readonly termsCheckbox: Locator;
  readonly checkoutButton: Locator;
  readonly qtyInput: Locator;
  readonly updateCartBtn: Locator;
  readonly cartTotalPrice: Locator;
  readonly removeFromCartCheckboxes: Locator;

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
    this.cartTotalPrice = page.locator(".product-subtotal").first();
    this.removeFromCartCheckboxes = page.locator(
      'input[name="removefromcart"]',
    );
  }

  async goToCart() {
    await this.shoppingCartLink.click();
  }

  /**
   * Empties the shared demo account's cart so every test starts from a known state.
   * Leftover items from earlier runs (or quantities changed by another test)
   * would otherwise change prices and make assertions unreliable.
   */
  async clearCart() {
    await this.page.goto("/cart");
    const count = await this.removeFromCartCheckboxes.count();
    if (count === 0) return;

    for (let i = 0; i < count; i++) {
      await this.removeFromCartCheckboxes.nth(i).check();
    }
    await this.updateCartBtn.click();
    await expect(this.removeFromCartCheckboxes).toHaveCount(0);
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
