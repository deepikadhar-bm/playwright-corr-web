import { Page, Locator } from '@playwright/test';

/**
 * Page Object: You have unsaved changes! If you leave, your changes
 * Elements: 1
 */
export class YouHaveUnsavedChangesIfYouLeaveYourChangesPage {
  constructor(private page: Page) {}

  get You_have_unsaved_changes_If_you_leave_your_changes(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"You have unsaved changes! If you leave, your changes will be lost.\"]]");
  }

}