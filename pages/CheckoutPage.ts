import { type Locator, type Page, expect } from "@playwright/test";

export class CheckoutPage {
  readonly page: Page;

  // Buttons
  readonly billingContinueBtn: Locator;
  readonly shippingContinueBtn: Locator;
  readonly shippingMethodContinueBtn: Locator;
  readonly paymentMethodContinueBtn: Locator;
  readonly paymentInfoContinueBtn: Locator;
  readonly confirmOrderBtn: Locator;
  readonly successTitle: Locator;

  // Form Fields
  readonly billingAddressDropdown: Locator;
  readonly countryDropdown: Locator;
  readonly cityInput: Locator;
  readonly address1Input: Locator;
  readonly zipCodeInput: Locator;
  readonly phoneInput: Locator;
  readonly zipCodeErrorMsg: Locator;

  constructor(page: Page) {
    this.page = page;

    // Buttons
    this.billingContinueBtn = page.locator(
      "#billing-buttons-container .new-address-next-step-button",
    );
    this.shippingContinueBtn = page.locator(
      "#shipping-buttons-container .new-address-next-step-button",
    );
    this.shippingMethodContinueBtn = page.locator(
      "#shipping-method-buttons-container .shipping-method-next-step-button",
    );
    this.paymentMethodContinueBtn = page.locator(
      "#payment-method-buttons-container .payment-method-next-step-button",
    );
    this.paymentInfoContinueBtn = page.locator(
      "#payment-info-buttons-container .payment-info-next-step-button",
    );
    this.confirmOrderBtn = page.locator(
      "#confirm-order-buttons-container .confirm-order-next-step-button",
    );
    this.successTitle = page.getByText(
      "Your order has been successfully processed!",
    );

    // Form Fields
    this.billingAddressDropdown = page.locator("#billing-address-select");
    this.countryDropdown = page.locator("#BillingNewAddress_CountryId");
    this.cityInput = page.locator("#BillingNewAddress_City");
    this.address1Input = page.locator("#BillingNewAddress_Address1");
    this.zipCodeInput = page.locator("#BillingNewAddress_ZipPostalCode");
    this.phoneInput = page.locator("#BillingNewAddress_PhoneNumber");
    this.zipCodeErrorMsg = page.getByText("Zip / postal code is required");
  }

  async fillNewBillingAddress() {
    // API 대기 코드를 싹 다 지우고, 사람처럼 순서대로 폼만 빠르게 채웁니다.
    await this.countryDropdown.selectOption({ label: "Canada" });
    await this.cityInput.fill("Toronto");
    await this.address1Input.fill("123 QA Automation St");
    await this.zipCodeInput.fill("M5V 2H1");
    await this.phoneInput.fill("416-123-4567");
  }

  async completeCheckoutSteps() {
    // 1. Billing
    await this.billingContinueBtn.waitFor({ state: "visible" });
    if (await this.countryDropdown.isVisible()) {
      await this.fillNewBillingAddress();
    }
    await this.billingContinueBtn.click();

    // 2. Shipping
    await this.shippingContinueBtn.waitFor({ state: "visible" });
    await this.shippingContinueBtn.click();

    // 3. Shipping Method
    await this.shippingMethodContinueBtn.waitFor({ state: "visible" });
    await this.shippingMethodContinueBtn.click();

    // 4. Payment Method
    await this.paymentMethodContinueBtn.waitFor({ state: "visible" });
    await this.paymentMethodContinueBtn.click();

    // 5. Payment Info
    await this.paymentInfoContinueBtn.waitFor({ state: "visible" });
    await this.paymentInfoContinueBtn.click();

    // 6. Confirm Order
    await this.confirmOrderBtn.waitFor({ state: "visible" });
    await this.confirmOrderBtn.click();
  }

  async triggerBillingValidationError() {
    await this.billingContinueBtn.waitFor({ state: "visible" });
    if (await this.billingAddressDropdown.isVisible()) {
      await this.billingAddressDropdown.selectOption({ label: "New Address" });
    }
    await this.billingContinueBtn.click();
  }

  async verifyZipCodeErrorIsDisplayed() {
    await expect(this.zipCodeErrorMsg).toBeVisible();
  }

  async verifyOrderSuccess() {
    await expect(this.successTitle).toBeVisible();
  }
}
