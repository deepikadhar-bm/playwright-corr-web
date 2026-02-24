import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Multiple client headers are mapped to the same Chase
 * Elements: 1
 */
export class MultipleClientHeadersAreMappedToTheSameChasePage {
  constructor(private page: Page) {}

  get Multiple_client_headers_are_mapped_to_the_same_Chase(): Locator {
    return this.page.locator("//div[contains(@class, 'modal-body')]");
  }

}