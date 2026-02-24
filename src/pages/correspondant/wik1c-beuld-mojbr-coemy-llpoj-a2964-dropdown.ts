import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Wik1C BeuLD MoJbr CoEmy LLpoJ - A2964 Dropdown
 * Elements: 1
 */
export class Wik1cBeuldMojbrCoemyLlpojA2964DropdownPage {
  constructor(private page: Page) {}

  get Wik1C_BeuLD_MoJbr_CoEmy_LLpoJ_A2964_Dropdown(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Wik1C BeuLD MoJbr CoEmy LLpoJ - A2964\"]]");
  }

}