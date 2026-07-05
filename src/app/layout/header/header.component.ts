import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../shared/models/user.model';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

/**
 * HeaderComponent
 * Top bar that shows the current page title, user info, and actions.
 * Page title is derived from the current route.
 *
 * NOTE ON TRANSLATION: `pageTitle` now holds the RESOLVED, display-ready
 * text (not a translation key), produced via TranslateService.instant().
 * The template can keep using {{ pageTitle }} exactly as before — no
 * `translate` pipe needed. Title is re-resolved on route change AND on
 * language change, so switching language updates the title immediately
 * even without navigating.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Output() menuToggle = new EventEmitter<void>();

  pageTitle = '';
  currentUser: User | null = null;

  // Tracks which translation key is currently active, so we can
  // re-resolve the same title when the language changes (without
  // needing to re-check the URL).
  private currentTitleKey = 'HEADER.DASHBOARD';

  private langChangeSub?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {
    // Get current user


    // Update page title based on route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updatePageTitle();
    });
  }

  ngOnInit(): void {
    // Set the initial title on load (router.events only fires on navigation,
    // not on the very first load in some setups)
    this.updatePageTitle();

    // Re-resolve the current title whenever the language is switched
    this.langChangeSub = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.pageTitle = this.translate.instant(this.currentTitleKey);
    });
  }

  ngOnDestroy(): void {
    this.langChangeSub?.unsubscribe();
  }

  onMenuToggle(): void {
    this.menuToggle.emit();
  }

  logout(): void {
    this.authService.logout();
  }

  /**
   * Derive a readable page title from the current URL path.
   */
  private updatePageTitle(): void {
    const url = this.router.url;

    if (url.includes('/dashboard')) {
      this.currentTitleKey = 'HEADER.DASHBOARD';
    } else if (url.includes('/clients/new')) {
      this.currentTitleKey = 'HEADER.NEW_CLIENT';
    } else if (url.includes('/clients/edit')) {
      this.currentTitleKey = 'HEADER.EDIT_CLIENT';
    } else if (url.includes('/clients')) {
      this.currentTitleKey = 'HEADER.CLIENTS';
    } else if (url.includes('/quotations')) {
      this.currentTitleKey = 'HEADER.QUOTATIONS';
    } else {
      this.currentTitleKey = 'HEADER.DASHBOARD';
    }

    this.pageTitle = this.translate.instant(this.currentTitleKey);
  }
}
