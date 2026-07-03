import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ClientsService } from '../../pages/clients/clients.service';
import { User } from '../../shared/models/user.model';

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
    private clientsService: ClientsService
  ) { }

  ngOnInit(): void {
    console.log('DashboardComponent initialized');
    // this.currentUser = this.authService.getUser();
    this.setGreeting();
    this.loadStats();
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
}
