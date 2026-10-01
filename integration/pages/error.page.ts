import type { Locator, Page } from '@playwright/test';

export type ErrorPageCode = 403 | 404;

export class ErrorPage {
  static readonly viewName = 'error-component';
  static readonly titles: Record<ErrorPageCode, string> = {
    403: 'You are not authorized to access this content.',
    404: "The content you specified can't be found",
  };

  readonly title: Locator;

  constructor(page: Page) {
    this.title = page.getByTestId('error-view-title');
  }

  static path(code: ErrorPageCode): string {
    return `/error/${code}`;
  }
}
