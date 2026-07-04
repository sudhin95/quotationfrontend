import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ClientsService } from '../../pages/clients/clients.service';
import { User } from '../../shared/models/user.model';
import { QuotationsService } from '../../pages/quotations/quotations.service';


/**
 * DashboardComponent
 * Welcome page showing a greeting and some high-level stats.
 * Stats will grow as we add quotation features later.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  currentUser: User | null = null;
  totalClients = 0;
  greeting = '';

  constructor(
    private authService: AuthService,
    private clientsService: ClientsService,
    private quotationsService: QuotationsService,
  ) { }

  ngOnInit(): void {
    console.log('DashboardComponent initialized');
    // this.currentUser = this.authService.getUser();
    this.setGreeting();
    this.loadStats();
    this.loadQuotations();
  }

  /**
   * Set a time-based greeting message.
   */
  private setGreeting(): void {
    const hour = new Date().getHours();
    if (hour < 12) {
      this.greeting = 'Good morning';
    } else if (hour < 17) {
      this.greeting = 'Good afternoon';
    } else {
      this.greeting = 'Good evening';
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

  totalQuotations:any=0;
   quotations: any[] = [];
  approvedCount = 0;
  approvedTotalAmount = 0;

    loadQuotations(): void {
    this.quotationsService.getQuotations().subscribe((data:any) => {
      console.log('Fetched quotations:', data);
      if(data && data.body && Array.isArray(data.body)) {
        this.quotations = data.body;
        this.totalQuotations = this.quotations.length
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
