import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Delete Map
 * Elements: 2
 */
export class DeleteMapPage {
  constructor(private page: Page) {}

  get Delete_Map(): Locator {
    return this.page.locator("//button[text()=\" Testsigma_29/04/2025/15:40:43cdad \"]/../..//button[@aria-label=\"Delete Map\"]");
  }

  get Delete_Option(): Locator {
    return this.page.locator("//span[@class=\"fas fa-trash-alt text-danger\"]");
  }

}