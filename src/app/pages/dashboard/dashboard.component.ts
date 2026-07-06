import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ClientsService } from '../../pages/clients/clients.service';
import { User } from '../../shared/models/user.model';
import { QuotationsService } from '../../pages/quotations/quotations.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

/**
 * DashboardComponent
 * Welcome page showing a greeting and some high-level stats.
 * Stats will grow as we add quotation features later.
 *
 * NOTE ON TRANSLATION: this component does not use the `translate` pipe
 * in its template. `greeting` and the static labels below are resolved
 * via TranslateService.instant() and read in the HTML with plain {{ }}
 * interpolation. Everything re-resolves on language change.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  currentUser: User | null = null;
  totalClients = 0;
  greeting = '';

  // Static labels resolved via translation, read directly in the template
  welcomeText = '';
  totalClientsLabel = '';
  quotationsLabel = '';
  approvedLabel = '';
  totalAmountLabel = '';
  defaultUserName = '';

  private langChangeSub?: Subscription;

  constructor(
    private authService: AuthService,
    private clientsService: ClientsService,
    private quotationsService: QuotationsService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    console.log('DashboardComponent initialized');
    // this.currentUser = this.authService.getUser();

    this.resolveAllText();

    // Re-resolve greeting + labels whenever the language is switched
    this.langChangeSub = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.resolveAllText();
    });

    this.loadStats();
    this.loadQuotations();
  }

  ngOnDestroy(): void {
    this.langChangeSub?.unsubscribe();
  }

  /**
   * Resolve the greeting + all static dashboard labels via translation.
   * Called on init and again whenever the language changes.
   */
  private resolveAllText(): void {
    this.setGreeting();
    this.welcomeText = this.translate.instant('DASHBOARD.WELCOME_TEXT');
    this.totalClientsLabel = this.translate.instant('DASHBOARD.TOTAL_CLIENTS');
    this.quotationsLabel = this.translate.instant('DASHBOARD.QUOTATIONS');
    this.approvedLabel = this.translate.instant('DASHBOARD.APPROVED');
    this.totalAmountLabel = this.translate.instant('DASHBOARD.TOTAL_AMOUNT');
    this.defaultUserName = this.translate.instant('DASHBOARD.DEFAULT_USER');
  }

  /**
   * Set a time-based greeting message (now via translation key).
   */
  private setGreeting(): void {
    const hour = new Date().getHours();
    if (hour < 12) {
      this.greeting = this.translate.instant('DASHBOARD.GREETING_MORNING');
    } else if (hour < 17) {
      this.greeting = this.translate.instant('DASHBOARD.GREETING_AFTERNOON');
    } else {
      this.greeting = this.translate.instant('DASHBOARD.GREETING_EVENING');
    }
  }

  /**
   * Load summary stats for the dashboard cards.
   */
  private loadStats(): void {
    this.clientsService.getClients().subscribe(clients => {
      this.totalClients = clients.length;
    });
  }

  totalQuotations: any = 0;
  quotations: any[] = [];
  approvedCount = 0;
  approvedTotalAmount = 0;

  loadQuotations(): void {
    this.quotationsService.getQuotations().subscribe((data: any) => {
      console.log('Fetched quotations:', data);
      if (data && data.body && Array.isArray(data.body)) {
        this.quotations = data.body;
        this.totalQuotations = this.quotations.length;
        this.calculateApprovedStats();
      }
    });
  }

  calculateApprovedStats(): void {
    const approved = this.quotations.filter(q => q.status === 2);
    this.approvedCount = approved.length;
    this.approvedTotalAmount = approved.reduce((sum, q) => sum + (q.totalamount || 0), 0);
  }
}
