import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  resource,
} from '@angular/core';
import { ErrorView, ErrorViewButton, ErrorViewConfig } from '@openmfp/ngx';
import { I18nService } from '@openmfp/portal-ui-lib';
import '@ui5/webcomponents-fiori/dist/illustrations/NoEntries.js';
import '@ui5/webcomponents-fiori/dist/illustrations/UnableToLoad.js';
import '@ui5/webcomponents-fiori/dist/illustrations/tnt/NoApplications.js';
import '@ui5/webcomponents-fiori/dist/illustrations/tnt/UnsuccessfulAuth.js';

@Component({
  selector: 'pm-error-state',
  standalone: true,
  templateUrl: './error-state.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ErrorView],
})
export class ErrorState {
  private i18nService = inject(I18nService);

  code = input.required<number>();
  subtitle = input<string | undefined>();
  retryable = input(true);
  retryDisabled = input(false);
  retry = output<void>();

  protected isSessionExpired = computed(() => this.code() === 401);

  protected texts = resource({
    loader: async () => ({
      contentNotFoundTitle: await this.i18nService.getTranslationAsync(
        'ERROR_CONTENT_NOT_FOUND_TITLE',
      ),
      contentNotFoundText: await this.i18nService.getTranslationAsync(
        'ERROR_CONTENT_NOT_FOUND_TEXT',
      ),
      sessionExpiredTitle:
        await this.i18nService.getTranslationAsync('SESSION_EXPIRED'),
      sessionExpiredText:
        await this.i18nService.getTranslationAsync('SIGN_IN_HINT'),
    }),
  });

  protected statusContent = computed<ErrorViewConfig>(() => {
    switch (this.code()) {
      case 401:
        return {
          illustration: 'tnt/UnsuccessfulAuth',
          title: this.texts.value()?.sessionExpiredTitle ?? '',
          subtitle: this.texts.value()?.sessionExpiredText ?? '',
        };
      case 403:
        return {
          illustration: 'tnt/UnsuccessfulAuth',
          title: 'You are not authorized to access this content.',
          subtitle: this.retryable()
            ? 'If access was just granted, try again.'
            : '',
        };
      case 404:
        return {
          illustration: 'NoEntries',
          title: this.texts.value()?.contentNotFoundTitle ?? '',
          subtitle: this.retryable()
            ? 'If it was just created, try again. Otherwise, check if the URL is correct.'
            : (this.texts.value()?.contentNotFoundText ?? ''),
        };
      case 422:
        return {
          illustration: 'tnt/NoApplications',
          title: 'The resource is pending deletion.',
          subtitle: '',
        };
      case 503:
        return {
          illustration: 'UnableToLoad',
          title: 'Organization is not ready yet',
          subtitle: 'Please try again later.',
        };
      default:
        return {
          illustration: 'UnableToLoad',
          title: 'Could not load resource',
          subtitle: 'Please try again.',
        };
    }
  });

  protected buttons = computed<ErrorViewButton[]>(() => {
    if (!this.retryable()) {
      return [];
    }
    if (this.isSessionExpired()) {
      return [{ key: 'sign-in', label: 'Login', design: 'Emphasized' }];
    }
    return [
      {
        key: 'retry',
        label: 'Retry',
        design: 'Emphasized',
        disabled: this.retryDisabled(),
      },
    ];
  });

  protected errorViewConfig = computed<ErrorViewConfig>(() => {
    const content = this.statusContent();
    return {
      ...content,
      subtitle: this.subtitle() ?? content.subtitle,
      buttons: this.buttons(),
    };
  });

  protected onButtonClick(button: ErrorViewButton): void {
    if (button.key === 'sign-in') {
      this.signIn();
    } else {
      this.retry.emit();
    }
  }

  protected signIn(): void {
    window.location.reload();
  }
}
