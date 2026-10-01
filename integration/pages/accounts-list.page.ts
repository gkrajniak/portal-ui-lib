import type { Locator, Page } from '@playwright/test';

export class AccountsListPage {
  static readonly path = '/home/accounts';
  static readonly viewName = 'generic-list-view';

  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open(): Promise<void> {
    await this.page.goto(AccountsListPage.path);
  }

  accountRow(accountName: string): Locator {
    return this.page.getByRole('row', { name: accountName });
  }

  async openAccount(accountName: string): Promise<void> {
    await this.accountRow(accountName).click();
  }
}
