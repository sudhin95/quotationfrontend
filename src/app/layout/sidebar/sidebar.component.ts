import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

/**
 * SidebarComponent
 * Dark-themed navigation sidebar with collapsible behaviour.
 *
 * NOTE ON TRANSLATION: this component does NOT use the `translate` pipe
 * in its template (it isn't available in this module). Instead, all
 * display text is resolved here via TranslateService.instant() and
 * exposed as plain properties / array fields, which the template reads
 * with normal {{ }} interpolation. Text is re-resolved whenever the
 * language changes via the onLangChange subscription.
 */
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {

  @Input() isCollapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  // Static translation keys per item — never shown directly, only used to look up text
  private menuItemsConfig = [
    { key: 'SIDEBAR.DASHBOARD', route: '/dashboard', icon: 'dashboard' },
    { key: 'SIDEBAR.CLIENTS', route: '/clients', icon: 'clients' },
    { key: 'SIDEBAR.QUOTATIONS', route: '/quotations', icon: 'quotations', disabled: false },
    { key: 'SIDEBAR.AI_LOGS', route: '/ai-logs', icon: 'ai-logs', disabled: false }
  ];

  // Resolved, display-ready menu items — template reads item.label directly, no pipe
  menuItems: any[] = [];

  // Other static text used in the template — resolved the same way
  brandText = '';
  comingSoonText = '';
  toggleSidebarTitle = '';
  collapseLabel = '';
  logoutTitle = '';
  logoutLabel = '';

  private langChangeSub?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.resolveAllText();

    // Re-resolve every label when the language is switched
    this.langChangeSub = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.resolveAllText();
    });
  }

  ngOnDestroy(): void {
    this.langChangeSub?.unsubscribe();
  }

  private resolveAllText(): void {
    this.menuItems = this.menuItemsConfig.map(item => ({
      ...item,
      label: this.translate.instant(item.key)
    }));

    this.brandText = this.translate.instant('SIDEBAR.BRAND');
    this.comingSoonText = this.translate.instant('SIDEBAR.COMING_SOON');
    this.toggleSidebarTitle = this.translate.instant('SIDEBAR.TOGGLE_SIDEBAR');
    this.collapseLabel = this.translate.instant('SIDEBAR.COLLAPSE');
    this.logoutTitle = this.translate.instant('SIDEBAR.LOGOUT');
    this.logoutLabel = this.translate.instant('SIDEBAR.LOGOUT');
  }

  onToggle(): void {
    this.toggleCollapse.emit();
  }

  logout(): void {
    this.authService.logout();
  }

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }
}
