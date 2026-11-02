import type { Locator, Page } from '@playwright/test';

export class FullPagePage {
  static readonly viewName = 'generic-detail-view';

  readonly readState: Locator;
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    this.readState = page.getByTestId('generic-detail-view-read-state');
  }

  static path(accountName: string): string {
    return `/home/accounts/${accountName}/full-page`;
  }

  field(property: string): Locator {
    return this.page.getByTestId(`generic-detail-view-field-${property}`);
  }
}
